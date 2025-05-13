"use server";

import { clerkClient, currentUser, Invitation } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import {
  Agency,
  Lane,
  Plan,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { v4 } from "uuid";
import { CreateFunnelFormSchema, CreateMediaType } from "./types";
import { z } from "zod";
import { serializePrismaData } from "@/lib/serialization";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;

  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });
    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser?.emailAddresses[0].emailAddress,
      },
    });
  }

  if (!userData) {
    console.log("Could not find user");
  }

  let foundAgencyId = agencyId;

  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error(
        "You need to provide atleast an agency Id or subaccount Id"
      );
    }
    const response = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
    });

    if (response) foundAgencyId = response.agencyId;
  }

  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: {
            id: subaccountId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;

  const response = await db.user.create({
    data: { ...user },
  });

  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.imageUrl,
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: `Joined`,
      subaccountId: undefined,
    });

    if (userDetails) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });
      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });

      return userDetails.agencyId;
    } else return null;
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return agency ? agency.agencyId : null;
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.agency.update({
    where: {
      id: agencyId,
    },
    data: { ...agencyDetails },
  });

  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({
    where: { id: agencyId },
  });
  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return userData;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;

  console.log("agency :", agency);

  const agencyWithRequiredFields = {
    ...agency,
    name: agency.name || agency.companyEmail.split("@")[0],
    agencyLogo: agency.agencyLogo || "",
    companyPhone: agency.companyPhone || "",
    address: agency.address || "",
    city: agency.city || "",
    zipCode: agency.zipCode || "",
    state: agency.state || "",
    country: agency.country || "",
  };
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agencyWithRequiredFields,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log("getNotificationandUser Query error :", error);
  }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;

  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: "AGENCY_OWNER",
    },
  });

  if (!agencyOwner) return console.log("🔴Error: could not create subaccount");

  const permissionId = v4();
  const response = await db.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
      SidebarOption: {
        create: [
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: "Automations",
            icon: "chip",
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
    },
  });
  return response;
};

export const getUserPermissions = async (userId: string) => {
  const response = await db.user.findUnique({
    where: { id: userId },
    select: { Permissions: { include: { SubAccount: true } } },
  });

  return response;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });
  await (
    await clerkClient()
  ).users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || "SUBACCOUNT_USER",
    },
  });

  return response;
};

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    return response;
  } catch (error) {
    console.log("🔴Could not change permission", error);
  }
};

export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });
  return response;
};

export const deleteSubAccount = async (subaccountId: string) => {
  const response = await db.subAccount.delete({
    where: { id: subaccountId },
  });
  return response;
};

export const deleteUser = async (userId: string) => {
  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  });
  const deletedUser = await db.user.delete({ where: { id: userId } });

  return deletedUser;
};

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const checkIfInvitationExists = async (
  email: string,
  agencyId: string
): Promise<boolean> => {
  const existingInvitation = await db.invitation.findUnique({
    where: { email, agencyId },
  });
  return !!existingInvitation;
};

export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  try {
    // create the invitation in your database
    const response = await db.invitation.create({
      data: { role, email, agencyId },
    });

    try {
      const clerk = await clerkClient();

      await clerk.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: process.env.NEXT_PUBLIC_URL,
        publicMetadata: {
          throughInvitation: true,
          role,
          agencyId,
        },
      });
    } catch (clerkError: any) {
      // Handle case where email already exists as a user in Clerk
      if (clerkError?.errors?.[0]?.code === "form_identifier_exists") {
        console.error(
          `Email ${email} already exists in Clerk. Skipping invitation.`
        );

        //  here we can delete db user from Invitation

        return {
          ...response,
          emailAlreadyExists: true,
        };
      }

      // Handle case where invitation already exists for this email
      if (clerkError?.errors?.[0]?.code === "duplicate_record") {
        console.error(
          `A pending invitation already exists for ${email}. Skipping Clerk invitation.`
        );

        return {
          ...response,
          invitationAlreadyExists: true,
        };
      }

      // For other Clerk errors, delete the invitation from your database
      await db.invitation.delete({ where: { id: response.id } });

      throw clerkError;
    }

    return response;
  } catch (error: any) {
    console.log("Send Invitation Error :: ", error);

    // Log the full error details when it's a Clerk error
    if (error && typeof error === "object" && "clerkError" in error) {
      console.log("Clerk Error Details:", {
        status: error.status,
        clerkTraceId: error.clerkTraceId,
      });

      // Log each error message separately for clarity
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: any, index: number) => {
          console.log(`Error ${index + 1}:`, JSON.stringify(err, null, 2));
        });
      }
    }

    throw error;
  }
};

export const getMedia = async (subaccountId: string) => {
  const mediaFiles = await db.subAccount.findUnique({
    where: { id: subaccountId },
    include: { Media: true },
  });
  return mediaFiles;
};

export const createMedia = async (
  subaccountId: string,
  mediaFile: CreateMediaType
) => {
  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      subAccountId: subaccountId,
    },
  });
  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: { id: mediaId },
  });
  return response;
};

export const getPipeLineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: { id: pipelineId },
  });
  return serializePrismaData(response);
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: { pipelineId },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: { order: "asc" },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });
  return serializePrismaData(response);
};

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string
) => {
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || v4(),
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  });

  return serializePrismaData(response);
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  return response;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  if (!lanes.length) {
    console.log("No lanes to reorder !!!");
    return;
  }

  try {
    await db.$transaction(
      lanes.map(({ id, order }) =>
        db.lane.update({
          where: { id },
          data: { order },
        })
      )
    );
    console.log("✅ Lanes reordered successfully");
  } catch (error) {
    console.error("❌ Failed to reorder lanes:", error);
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  if (!tickets.length) {
    console.log("No tickets to reorder");
    return;
  }

  try {
    await db.$transaction(
      tickets.map(({ id, order, laneId }) =>
        db.ticket.update({
          where: { id },
          data: { order, laneId },
        })
      )
    );
    console.log("✅ Ticket order updated successfully");
  } catch (error) {
    console.error("❌ Failed to update ticket order:", error);
  }
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });
    order = lanes.length;
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  });

  return response;
};

export const deleteLane = async (laneId: string) => {
  const response = await db.lane.delete({
    where: { id: laneId },
  });
  return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: { Lane: { pipelineId } },
    include: { Tags: true, Assigned: true, Customer: true },
  });
  return response;
};

export const _getTicketWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId: laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  });
  return response;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  const subaccountUsersWithAcess = await db.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: { id: subaccountId },
        },
      },
      role: "SUBACCOUNT_USER",
      Permissions: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
  });
  return subaccountUsersWithAcess;
};

export const searchContacts = async (searchQuery: string) => {
  const response = await db.contact.findMany({
    where: {
      name: { contains: searchQuery },
    },
  });
  return response;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  const ticketId: string = ticket.id || v4();

  const order =
    ticket.order ??
    (await db.ticket.count({ where: { laneId: ticket.laneId } }));

  const response = await db.ticket.upsert({
    where: { id: ticketId },
    update: { ...ticket, Tags: { set: tags } },
    create: {
      ...ticket,
      id: ticketId,
      order,
      Tags: { connect: tags },
    },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  });

  return serializePrismaData(response);
};

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: { id: ticketId },
  });
  return serializePrismaData(response);
};

export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) => {
  const id = tag.id || v4();
  const tagData = { ...tag, id };

  const response = db.tag.upsert({
    where: { id },
    update: tagData,
    create: { ...tagData, subAccountId: subaccountId },
  });
  return response;
};

export const getTagsForSubaccount = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: { id: subaccountId },
    select: { Tags: true },
  });
  return response;
};

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({ where: { id: tagId } });
  return response;
};

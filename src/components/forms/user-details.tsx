"use client";
import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from "@/lib/queries";
import {
  AuthUserWithAgencySigebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubAccount, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../global/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { v4 } from "uuid";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userData?: Partial<User> | null;
  subAccounts?: SubAccount[];
};

const userDataSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 chars." }),
  email: z.string().email({ message: "Invalid email address" }),
  avatarUrl: z.string(),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

const UserDetails = ({ id, type, userData, subAccounts }: Props) => {
  const [subAccountPermissions, setSubAccountsPermissions] =
    useState<UserWithPermissionsAndSubAccounts | null>(null);
  const { data, setClose } = useModal();
  const [roleState, setRoleState] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof userDataSchema>>({
    mode: "onChange",
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  // get authUserDetails
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getAuthUserDetails();
        if (response) setAuthUserData(response);
      } catch (error) {
        console.error("Error fetching auth user details :", error);
      }
    };
    fetchDetails();
  }, []);

  // get permissions
  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data?.user?.id);
      setSubAccountsPermissions(permission);
    };
    getPermissions();
  }, [data, form]);

  //reset form
  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [userData, data, form]);

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!data.user?.email) return;
    setLoadingPermissions(true);
    const response = await changeUserPermissions(
      permissionsId ? permissionsId : v4(),
      data.user.email,
      subAccountId,
      val
    );
    if (type === "agency") {
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Gave ${userData?.name} access to | ${
          subAccountPermissions?.Permissions.find(
            (p) => p.subAccountId === subAccountId
          )?.SubAccount.name
        } `,
        subaccountId: subAccountPermissions?.Permissions.find(
          (p) => p.subAccountId === subAccountId
        )?.SubAccount.id,
      });
    }
    if (response) {
      toast.success("The request was successfull");
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((permi) => {
          if (permi.subAccountId === subAccountId) {
            return { ...permi, access: !permi.access };
          }
          return permi;
        });
      }
    } else {
      toast.error("Could not update permissions");
    }
    router.refresh();
    setLoadingPermissions(false);
  };

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (userData || data?.user) {
      const updatedUser = await updateUser(values);

      if (authUserData?.Agency?.SubAccount && authUserData.Permissions) {
        const subaccountsWithAccess = authUserData.Agency.SubAccount.filter(
          (subacc) =>
            authUserData.Permissions.find(
              (p) => p.subAccountId === subacc.id && p.access
            )
        );

        for (const subaccount of subaccountsWithAccess) {
          await saveActivityLogsNotification({
            agencyId: undefined,
            description: `Updated ${userData?.name} information`,
            subaccountId: subaccount.id,
          });
        }
      }

      if (updatedUser) {
        toast.success("Update User Information");
        setClose();
        router.refresh();
      } else {
        toast.error("Oopse! Could not update user information");
      }
    } else {
      console.log("Error could not submit user-details form !!!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Full Name"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* todo - chk disabled here */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    disabled={
                      form.formState.isSubmitting ||
                      field.value === "AGENCY_OWNER"
                    }
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleState(
                          "You need to have subaccounts to assign Subaccount access to team members."
                        );
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />

            {/* <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save User Details"}
            </Button> */}

            <Button
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              type="submit"
              className={!form.formState.isDirty ? "text-muted-foreground" : ""}
            >
              {form.formState.isSubmitting ? (
                <Loading />
              ) : form.formState.isDirty ? (
                "Save User Details"
              ) : (
                "No changes made"
              )}
            </Button>

            {authUserData?.role === "AGENCY_OWNER" && (
              <div>
                <Separator className="my-4" />
                <FormLabel>User Permissions</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account to team member by turning on access
                  control for each Sub Account. This is only visible to agency
                  owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {subAccounts?.map((subaccount) => {
                    const subAccountPermissionsDetails =
                      subAccountPermissions?.Permissions.find(
                        (p) => p.subAccountId === subaccount.id
                      );
                    return (
                      <div
                        key={subaccount.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p>{subaccount.name}</p>
                        </div>
                        <Switch
                          disabled={loadingPermissions}
                          checked={subAccountPermissionsDetails?.access}
                          onCheckedChange={(permission) => {
                            onChangePermission(
                              subaccount.id,
                              permission,
                              subAccountPermissionsDetails?.id
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;

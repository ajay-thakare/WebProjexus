// import { EditorBtns } from "@/lib/constants";
// import Image from "next/image";
// import React from "react";

// type Props = {};

// const CheckoutPlaceholder = (props: Props) => {
//   const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
//     if (type === null) return;
//     e.dataTransfer.setData("componentType", type);
//   };
//   return (
//     <div
//       draggable
//       onDragStart={(e) => handleDragStart(e, "paymentForm")}
//       className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
//     >
//       <Image
//         src="/stripelogo.png"
//         height={40}
//         width={40}
//         alt="stripe logo"
//         className="object-cover"
//       />
//     </div>
//   );
// };

// export default CheckoutPlaceholder;

import { EditorBtns } from "@/lib/constants";
import { CreditCard, Sparkles } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const CheckoutPlaceholder = (props: Props) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleClick = () => {
    setIsClicked(true);

    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <div
      draggable
      onClick={handleClick}
      onDragStart={(e) => {
        handleDragState(e, "paymentForm");
      }}
      className="group h-14 w-14 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-lg flex items-center justify-center border border-purple-200 dark:border-purple-700/50 cursor-pointer active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src="/stripelogo.png"
          alt="Stripe Logo"
          className="w-10 h-10 object-contain transition-all duration-200 opacity-70 group-hover:opacity-90"
          onError={(e) => {
            console.error("Stripe logo failed to load");
            e.currentTarget.style.display = "none";
            // Show fallback icon if image fails
            const fallbackIcon = document.createElement("div");
            fallbackIcon.innerHTML =
              '<svg class="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>';
            e.currentTarget.parentNode?.appendChild(fallbackIcon);
          }}
        />
        {isClicked && (
          <Sparkles
            size={14}
            className="absolute -top-1 -right-1 text-purple-500 transition-opacity animate-ping"
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutPlaceholder;

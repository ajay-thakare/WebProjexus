"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  element: EditorElement;
};

const CountdownComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const handleDelete = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  useEffect(() => {
    const content = props.element.content;
    if (!Array.isArray(content) && content.targetDate) {
      const targetDate = new Date(content.targetDate);

      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
          setIsExpired(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        setIsExpired(false);
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      };

      // Update immediately
      updateCountdown();

      // Then update every second
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [props.element.content]);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div
      style={props.element.styles}
      className={clsx("p-[2px] w-full m-[5px] relative text-center", {
        "!border-blue-500":
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        "!border-solid":
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClick}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <>
            <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
              {props.element.name}
            </Badge>
            <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[23px] -right-[1px] rounded-none rounded-t-lg !text-white">
              <Trash
                className="cursor-pointer"
                size={16}
                onClick={handleDelete}
              />
            </div>
          </>
        )}

      {isExpired ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-2xl font-bold text-red-500 animate-pulse">
            🎉 Time's Up! 🎉
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 md:gap-6 p-4">
          {/* Days */}
          {timeLeft.days > 0 && (
            <>
              <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl md:text-4xl font-bold text-primary">
                  {formatNumber(timeLeft.days)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                  {timeLeft.days === 1 ? "Day" : "Days"}
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-muted-foreground">
                :
              </div>
            </>
          )}

          {/* Hours */}
          <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl md:text-4xl font-bold text-primary">
              {formatNumber(timeLeft.hours)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium">
              {timeLeft.hours === 1 ? "Hour" : "Hours"}
            </div>
          </div>

          <div className="text-xl md:text-2xl font-bold text-muted-foreground">
            :
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl md:text-4xl font-bold text-primary">
              {formatNumber(timeLeft.minutes)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium">
              {timeLeft.minutes === 1 ? "Min" : "Mins"}
            </div>
          </div>

          <div className="text-xl md:text-2xl font-bold text-muted-foreground">
            :
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl md:text-4xl font-bold text-red-500 animate-pulse">
              {formatNumber(timeLeft.seconds)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium">
              {timeLeft.seconds === 1 ? "Sec" : "Secs"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownComponent;

"use client";
import { useEditor } from "@/providers/editor/editor-provider";

/**
 * Utility functions for settings components
 */

/**
 * Updates the styles of the selected element
 */
export const useStylesUpdater = () => {
  const { state, dispatch } = useEditor();

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [styleSettings]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  };

  return { handleOnChanges, state, dispatch };
};

/**
 * Updates the custom values of the selected element
 */
export const useCustomValuesUpdater = () => {
  const { state, dispatch } = useEditor();

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  return { handleChangeCustomValues, state, dispatch };
};

"use client";
import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-actions";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { FunnelPage } from "@prisma/client";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export interface TabItem {
  id: string;
  label: string;
  content: string;
  elements?: EditorElement[];
  backgroundColor?: string;
  textColor?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
}

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  formProps?: {
    formTitle?: string;
    formDescription?: string;
    action?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH";
    enctype?:
      | "application/x-www-form-urlencoded"
      | "multipart/form-data"
      | "text/plain";
    target?: "_self" | "_blank" | "_parent" | "_top";
    submitButtonText?: string;
    resetButtonText?: string;
    showResetButton?: boolean;
    successMessage?: string;
    errorMessage?: string;
    novalidate?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    submitButtonColor?: string;
    submitButtonTextColor?: string;
    resetButtonColor?: string;
    resetButtonTextColor?: string;
  };
  content:
    | EditorElement[]
    | {
        href?: string;
        innerText?: string;
        src?: string;
        alt?: string;
        targetDate?: string;
        target?: string;
        action?: "scroll" | "download" | "popup" | "submit";
        // audio

        controls?: boolean;
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;

        // divider
        dividerStyle?: "solid" | "dashed" | "dotted" | "thick";
        dividerColor?: string;
        dividerThickness?: number;

        // list
        items?: string[];
        listType?: "unordered" | "ordered" | "none";

        // Icon
        iconColor?: string;
        iconSize?: number;
        iconName?: string;

        // 3-columns
        columnGap?: number;
        column1Width?: number;
        column2Width?: number;
        column3Width?: number;
        column1Elements?: EditorElement[];
        column2Elements?: EditorElement[];
        column3Elements?: EditorElement[];
        // spacer
        spacerHeight?: number;
        spacerWidth?: string;
        spacerBackgroundColor?: string;

        // tabs
        tabs?: TabItem[];
        tabsBackgroundColor?: string;
        tabsHeaderBackgroundColor?: string;
        tabsContentBackgroundColor?: string;

        // Input
        inputType?: string;
        placeholder?: string;
        label?: string;
        required?: boolean;
        disabled?: boolean;
        value?: string;
        name?: string;
        helperText?: string;
        errorText?: string;
        backgroundColor?: string;
        textColor?: string;
        borderColor?: string;
        focusBorderColor?: string;
        labelColor?: string;
        placeholderColor?: string;

        // textarea
        rows?: number;
        maxLength?: number;
        minLength?: number;
        resize?: string;

        // checkbox
        // size?: string;
        // layout?: string;
        checkboxColor?: string;
        focusColor?: string;
        checked?: boolean;

        // radio
        groupLabel?: string;
        selectedValue?: string;
        options?: { id: string; label: string; value: string }[];
        radioColor?: string;
        groupLabelColor?: string;

        // select
        multiple?: boolean;

        // embed/code properties
        embedType?: "custom" | "iframe" | "youtube" | "script";
        embedCode?: string;
        iframeSrc?: string;
        allowFullscreen?: boolean;
        sandbox?: string;
        width?: string;
        height?: string;
        loading?: "lazy" | "eager";
        allowScripts?: boolean;
        showPreview?: boolean;

        // social Icons
        socialLinks?: Array<{
          id: string;
          platform: string;
          url: string;
          label: string;
        }>;
        iconSpacing?: number;
        layout?: "horizontal" | "vertical" | "grid" | string;
        style?: "filled" | "outlined" | "minimal" | "rounded";
        hoverColor?: string;
        borderRadius?: number;
        showLabels?: boolean;
        openInNewTab?: boolean;
        hoverEffect?: "none" | "scale" | "bounce" | "fade" | "slide";
        alignment?: "left" | "center" | "right";
        customColors?: boolean;

        // popup/modal properties
        triggerType?: "click" | "hover" | "auto" | "scroll" | "time" | "exit";
        triggerText?: string;
        popupTitle?: string;
        popupContent?: string;
        popupSize?: "small" | "medium" | "large" | "fullscreen" | "custom";
        position?:
          | "center"
          | "top"
          | "bottom"
          | "left"
          | "right"
          | "top-left"
          | "top-right"
          | "bottom-left"
          | "bottom-right";
        animation?:
          | "fadeIn"
          | "slideUp"
          | "slideDown"
          | "slideLeft"
          | "slideRight"
          | "zoomIn"
          | "bounce"
          | "flip";
        overlay?: boolean;
        closeOnOverlay?: boolean;
        closeOnEscape?: boolean;
        showCloseButton?: boolean;
        autoClose?: boolean;
        autoCloseDelay?: number;
        // popup-Trigger settings
        scrollTrigger?: boolean;
        scrollPercentage?: number;
        timeTrigger?: boolean;
        timeDelay?: number;
        exitIntentTrigger?: boolean;
        // popup-Style settings
        overlayColor?: string;
        padding?: number;
        maxWidth?: number;
        maxHeight?: number;
        // popup-Button styles
        triggerButtonStyle?:
          | "primary"
          | "secondary"
          | "outline"
          | "ghost"
          | "link";
        triggerButtonColor?: string;
        triggerButtonTextColor?: string;

        // tooltip properties
        tooltipContent?: string;
        triggerTypee?: "hover" | "click" | "focus" | "manual";
        positionn?:
          | "top"
          | "bottom"
          | "left"
          | "right"
          | "top-start"
          | "top-end"
          | "bottom-start"
          | "bottom-end"
          | "left-start"
          | "left-end"
          | "right-start"
          | "right-end";
        theme?:
          | "dark"
          | "light"
          | "warning"
          | "error"
          | "success"
          | "info"
          | "custom";
        size?: "small" | "medium" | "large" | "custom" | string;
        animationn?:
          | "fade"
          | "scale"
          | "shift"
          | "perspective"
          | "slide"
          | "none";
        arrow?: boolean;
        delay?: number;
        hideDelay?: number;
        offset?: number;
        followCursor?: boolean;
        interactive?: boolean;
        multiline?: boolean;
        // Custom styling for tooltips
        customStyle?: boolean;
        fontSize?: number;
        // Trigger element styling
        triggerStyle?: "button" | "text" | "icon" | "badge" | "link";
        triggerUnderline?: boolean;
        // testimonial properties
        testimonials?: Array<{
          id: string;
          quote: string;
          author: string;
          position: string;
          company: string;
          avatar: string;
          rating: number;
        }>;
        layoutt?:
          | "card"
          | "quote"
          | "minimal"
          | "bubble"
          | "split"
          | "centered";
        stylee?:
          | "modern"
          | "classic"
          | "elegant"
          | "corporate"
          | "creative"
          | "minimal";
        showAvatar?: boolean;
        showRating?: boolean;
        showQuotes?: boolean;
        showCompany?: boolean;
        autoplaySpeed?: number;
        showNavigation?: boolean;
        showDots?: boolean;
        itemsPerView?: number;
        // testimonial styling
        quoteColor?: string;
        authorColor?: string;
        positionColor?: string;
        cardBackground?: string;
        cardBorder?: string;
        ratingColor?: string;
        spacing?: number;

        // Add these properties to your EditorElement content type union in editor-provider.tsx:

        // contact form properties
        formTitle?: string;
        formDescription?: string;
        submitText?: string;
        successMessage?: string;
        errorMessage?: string;

        // Form configuration
        action1?: string;
        method?: "GET" | "POST";
        redirectUrl?: string;
        emailTo?: string;
        emailSubject?: string;

        // Fields configuration
        fields?: Array<{
          id: string;
          type: string;
          label: string;
          placeholder: string;
          required: boolean;
          enabled: boolean;
          options?: Array<{ value: string; label: string }>;
        }>;

        layout1?: "vertical" | "horizontal" | "inline";
        showPlaceholders?: boolean;
        showRequiredIndicator?: boolean;
        enableValidation?: boolean;
        showProgressBar?: boolean;
        enableSpamProtection?: boolean;

        // Contact form styling
        formBackground?: string;
        formBorder?: string;
        titleColor?: string;
        descriptionColor?: string;
        inputBackground?: string;
        inputBorder?: string;
        inputFocusBorder?: string;
        buttonBackground?: string;
        buttonText?: string;
        buttonHover?: string;
      };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

// recursive fun
const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT")
    throw new Error(
      "You sent the wrong action type to the Add Element editor State"
    );

  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    return item;
  });
};

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") {
    throw new Error(
      "You sent the wrong action type to the update Element State"
    );
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
};

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT")
    throw new Error(
      "You sent the wrong action type to the Delete Element editor State"
    );
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
};

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };
      // Update the history to include the entire updated EditorState
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState }, // Save a copy of the updated state
      ];

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };

      return newEditorState;

    case "UPDATE_ELEMENT":
      // update the element in the state
      const updatedElements = updateAnElement(state.editor.elements, action);

      const UpdatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate }, // Save a copy of the updated state
      ];

      const updatedEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };

      return updatedEditor;

    case "DELETE_ELEMENT":
      // Delete the element from the state
      const updatedElementsAfterDelete = deleteAnElement(
        state.editor.elements,
        action
      );

      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
      };

      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete }, // Save a copy of the updated state
      ];

      const deletedState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      };

      return deletedState;

    case "CHANGE_CLICKED_ELEMENT":
      // to track clicked element
      const clickedState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor }, // Save a copy of the current editor state
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };

      return clickedState;

    case "CHANGE_DEVICE":
      const changedDeviceState = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };
      return changedDeviceState;

    case "TOGGLE_PREVIEW_MODE":
      const toggleState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };
      return toggleState;

    case "TOGGLE_LIVE_MODE":
      const toggleLiveMode: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };
      return toggleLiveMode;

    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
        return undoState;
      }
      return state;

    // when we try to access a new page or domain then we have to load some data
    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      };

    case "SET_FUNNELPAGE_ID":
      const { funnelPageId } = action.payload;

      const updatedEditorStateWithFunnelPageId = {
        ...state.editor,
        funnelPageId,
      };

      const updatedHistoryWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithFunnelPageId }, // Save a copy of the updated state
      ];

      const funnelPageIdState = {
        ...state,
        editor: updatedEditorStateWithFunnelPageId,
        history: {
          ...state.history,
          history: updatedHistoryWithFunnelPageId,
          currentIndex: updatedHistoryWithFunnelPageId.length - 1,
        },
      };
      return funnelPageIdState;

    default:
      return state;
  }
};

// context
export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
}>({
  state: initialState,
  dispatch: () => undefined,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
});

type EditorProps = {
  children: React.ReactNode;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage;
};

// editor provider
const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        subaccountId: props.subaccountId,
        funnelId: props.funnelId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hook must be used within the editor Provider");
  }
  return context;
};

export default EditorProvider;

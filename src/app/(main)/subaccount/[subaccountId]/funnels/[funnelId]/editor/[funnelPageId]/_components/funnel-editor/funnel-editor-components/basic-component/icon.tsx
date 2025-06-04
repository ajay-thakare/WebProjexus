"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import {
  Trash,
  Star,
  Heart,
  Home,
  User,
  Mail,
  Phone,
  Search,
  Settings,
  Calendar,
  Clock,
  Camera,
  Music,
  Video,
  File,
  Folder,
  Download,
  Upload,
  Edit,
  Delete,
  Plus,
  Minus,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Share,
  Copy,
  Save,
  Maximize,
  Minimize,
  Volume1,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  MessageCircle,
  Bell,
  Shield,
  Globe,
  Wifi,
  Battery,
  Bluetooth,
  Headphones,
  Mic,
  Speaker,
  Zap,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Gift,
  Award,
  Trophy,
  Target,
  Bookmark,
  Tag,
  Filter,
  Grid,
  List,
  Layout,
  Sidebar,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

// Icon mapping object
const iconMap = {
  star: Star,
  heart: Heart,
  home: Home,
  user: User,
  mail: Mail,
  phone: Phone,
  search: Search,
  settings: Settings,
  calendar: Calendar,
  clock: Clock,
  camera: Camera,
  music: Music,
  video: Video,
  file: File,
  folder: Folder,
  download: Download,
  upload: Upload,
  edit: Edit,
  delete: Delete,
  plus: Plus,
  minus: Minus,
  check: Check,
  x: X,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  eye: Eye,
  "eye-off": EyeOff,
  lock: Lock,
  unlock: Unlock,
  share: Share,
  copy: Copy,
  save: Save,
  maximize: Maximize,
  minimize: Minimize,
  volume: Volume1,
  "volume-x": VolumeX,
  play: Play,
  pause: Pause,
  "skip-back": SkipBack,
  "skip-forward": SkipForward,
  shuffle: Shuffle,
  repeat: Repeat,
  "message-circle": MessageCircle,
  bell: Bell,
  shield: Shield,
  globe: Globe,
  wifi: Wifi,
  battery: Battery,
  bluetooth: Bluetooth,
  headphones: Headphones,
  mic: Mic,
  speaker: Speaker,
  zap: Zap,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  "map-pin": MapPin,
  navigation: Navigation,
  compass: Compass,
  flag: Flag,
  gift: Gift,
  award: Award,
  trophy: Trophy,
  target: Target,
  bookmark: Bookmark,
  tag: Tag,
  filter: Filter,
  grid: Grid,
  list: List,
  layout: Layout,
  sidebar: Sidebar,
  menu: Menu,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  info: Info,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  "help-circle": HelpCircle,
};

const IconComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (Array.isArray(props.element.content)) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 text-red-600 rounded">
        <p>Icon component error: Invalid content structure</p>
      </div>
    );
  }

  // Type assertion for content
  const content = props.element.content as {
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  // Convert style properties to React's camelCase format
  const convertStyles = (styles: React.CSSProperties) => {
    return Object.keys(styles).reduce((acc, key) => {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return { ...acc, [camelCaseKey]: styles[key as keyof typeof styles] };
    }, {} as React.CSSProperties);
  };

  const styles = convertStyles(props.element.styles);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const iconName = props.element.content?.iconName || "star";
  const iconSize = props.element.content?.iconSize || 24;
  const iconColor = props.element.content?.iconColor || "currentColor";

  // Get the icon component from the map
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Star;

  return (
    <div
      style={styles}
      className={clsx(
        "p-[2px] w-full m-[5px] relative transition-all flex items-center justify-center",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,
          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      <IconComponent
        size={iconSize}
        style={{ color: iconColor }}
        className="transition-colors"
      />

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default IconComponent;

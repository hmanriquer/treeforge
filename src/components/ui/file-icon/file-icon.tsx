import * as React from "react";
import {
  FaReact,
  FaAngular,
  FaRust,
  FaPython,
  FaNodeJs,
  FaDocker,
  FaMarkdown,
  FaHtml5,
  FaCss3Alt,
  FaJava,
  FaPhp,
  FaSwift,
  FaVuejs,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiSharp,
  SiTypescript,
  SiJavascript,
  SiGo,
  SiRuby,
  SiKotlin,
  SiCplusplus,
  SiC,
  SiSvelte,
  SiJson,
} from "react-icons/si";
import { FileCode, FileText, FileImage, File, Terminal } from "lucide-react";

interface FileIconProps extends React.HTMLAttributes<SVGElement> {
  filename: string;
  className?: string;
}

type IconConfig = {
  Icon: React.ElementType;
  className: string;
};

// Map for specific complete filenames
const exactMatches: Record<string, IconConfig> = {
  "dockerfile": { Icon: FaDocker, className: "text-blue-500" },
  "package.json": { Icon: FaNodeJs, className: "text-green-600" },
  "package-lock.json": { Icon: FaNodeJs, className: "text-gray-500" },
  ".gitignore": { Icon: FaGitAlt, className: "text-orange-500" },
  ".env": { Icon: Terminal, className: "text-gray-500" },
  "license": { Icon: FileText, className: "text-yellow-600" },
};

// Map for file extensions
const extensionMatches: Record<string, IconConfig> = {
  // Web Frameworks & Libraries
  tsx: { Icon: FaReact, className: "text-blue-400" },
  jsx: { Icon: FaReact, className: "text-blue-400" },
  "component.html": { Icon: FaAngular, className: "text-red-500" },
  "component.ts": { Icon: FaAngular, className: "text-red-500" },
  vue: { Icon: FaVuejs, className: "text-green-500" },
  svelte: { Icon: SiSvelte, className: "text-orange-500" },

  // Programing Languages & Scripts
  ts: { Icon: SiTypescript, className: "text-blue-500" },
  js: { Icon: SiJavascript, className: "text-yellow-400" },
  py: { Icon: FaPython, className: "text-blue-500" },
  rs: { Icon: FaRust, className: "text-orange-500" },
  go: { Icon: SiGo, className: "text-cyan-500" },
  cs: { Icon: SiSharp, className: "text-purple-600" },
  cpp: { Icon: SiCplusplus, className: "text-blue-500" },
  c: { Icon: SiC, className: "text-blue-500" },
  java: { Icon: FaJava, className: "text-red-500" },
  php: { Icon: FaPhp, className: "text-indigo-400" },
  rb: { Icon: SiRuby, className: "text-red-500" },
  kt: { Icon: SiKotlin, className: "text-purple-500" },
  swift: { Icon: FaSwift, className: "text-orange-500" },

  // Markup & Styling
  html: { Icon: FaHtml5, className: "text-orange-500" },
  css: { Icon: FaCss3Alt, className: "text-blue-500" },
  scss: { Icon: FaCss3Alt, className: "text-pink-500" },
  json: { Icon: SiJson, className: "text-yellow-500" },
  md: { Icon: FaMarkdown, className: "text-blue-400" },

  // Shell & Config
  sh: { Icon: Terminal, className: "text-green-500" },
  bat: { Icon: Terminal, className: "text-gray-500" },
  yaml: { Icon: FileText, className: "text-red-400" },
  yml: { Icon: FileText, className: "text-red-400" },
  xml: { Icon: FileCode, className: "text-orange-500" },

  // Media
  png: { Icon: FileImage, className: "text-blue-300" },
  jpg: { Icon: FileImage, className: "text-blue-300" },
  jpeg: { Icon: FileImage, className: "text-blue-300" },
  gif: { Icon: FileImage, className: "text-blue-300" },
  svg: { Icon: FileImage, className: "text-orange-400" },
  ico: { Icon: FileImage, className: "text-yellow-400" },
};

export function FileIcon({ filename, className, ...props }: FileIconProps) {
  const lowerName = filename.toLowerCase();

  // 1. Check exact matches (e.g., Dockerfile, package.json)
  if (exactMatches[lowerName]) {
    const { Icon, className: configClass } = exactMatches[lowerName];
    return <Icon className={`${configClass} ${className || ""}`} {...props as any} />;
  }

  // 2. Check compound extensions (e.g., .component.html)
  const compoundMatch = Object.keys(extensionMatches).find(
    (ext) => lowerName.endsWith("." + ext) && ext.includes(".")
  );

  if (compoundMatch) {
    const { Icon, className: configClass } = extensionMatches[compoundMatch];
    return <Icon className={`${configClass} ${className || ""}`} {...props as any} />;
  }

  // 3. Check simple extensions
  const extensionMatch = filename.match(/\.([^.]+)$/);
  if (extensionMatch) {
    const ext = extensionMatch[1].toLowerCase();
    if (extensionMatches[ext]) {
      const { Icon, className: configClass } = extensionMatches[ext];
      return <Icon className={`${configClass} ${className || ""}`} {...props as any} />;
    }
  }

  // 4. Default Fallback
  return <File className={`text-slate-500 ${className || ""}`} {...props as any} />;
}

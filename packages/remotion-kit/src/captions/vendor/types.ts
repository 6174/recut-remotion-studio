export interface WordTiming {
  text: string;
  start: number; // seconds
  end: number;   // seconds
  emphasis?: boolean;
}

export interface CaptionLine {
  words: WordTiming[];
}

export interface CaptionsData {
  lines: CaptionLine[];
}

export interface CaptionThemeProps {
  primaryColor?: string;
  secondaryColor?: string;
  data: CaptionsData;
  theme?: string;
  fontSize?: number | string;
  /** 可选字体覆盖（如用户经字体微调选择的家族名）；缺省时主题用自带默认家族。 */
  fontFamily?: string | null;
}

export interface InternalThemeProps {
  primaryColor: string;
  secondaryColor: string;
  data: CaptionsData;
  fontSize?: number | string;
  fontFamily?: string | null;
}


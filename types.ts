
import { IconName } from './components/common/Icon';

export interface Spot {
  id: string;
  name: string;
  coord: string; // "lng,lat"
  distance: string;
  intro_short: string;
  imagePrompt: string; // Dynamic prompt for image generation
  intro_txt: string;
  position: { top: string; left: string; }; // For map view
  tags?: string[]; // New: AI Smart Tags
  postcardText?: string; // New: Poetic summary for postcard
  imageUrl?: string; // Optional direct URL override
  recommender?: string;
  audioUrl?: string; // New: Path to a pre-generated MP3 for reliable playback
}

export interface Route {
  name: string;
  category: '历史文化' | '自然风景' | '美食体验';
  description: string;
  spots: Spot[];
  imagePrompt: string; // Dynamic prompt for image generation
  imageUrl?: string; // Optional direct URL override for route cover
}

export interface Business {
  name: string;
  type: '餐饮' | '住宿' | '纪念品';
  coord: string;
  address: string;
  distance: string;
}

export interface Product {
  name: string;
  feature: string;
  spec: string;
  price: string;
  business: string;
}

export interface ShoppingInfo {
  businesses: Business[];
  products: Product[];
  recommend_text: string;
}

export interface VoiceResponse {
  text: string;
  audio_base_64: string;
  need_manual_input: boolean;
}

export interface RecognitionResponse {
  explanation: string;
  audio_base_64: string;
  memorial_image: string;
}

export interface MemorialAlbum {
  cover_url: string;
  download_url: string;
  share_url: string;
}

export interface NavigationInfo {
  route_text: string;
  walking_time: string;
}

export interface AgentColorClasses {
  bg: string;
  border: string;
  text: string;
  shadow: string;
  iconBg: string;
}

// Defines the structure for an AI Agent UI
export interface Agent {
  id: 'A' | 'B' | 'C' | 'D' | 'RED' | 'ECO' | 'FOOD';
  name: string;
  description: string;
  icon: IconName; 
  imageUrl?: string;
  interactionType: 'voice' | 'photo' | 'shop' | 'system';
  actionText: string;
  colorClasses: AgentColorClasses;
}

export interface RelatedKnowledge {
  title: string;
  content: string;
  imageUrl?: string; // Added to support visual enhancement in modal
}

export interface Celebrity {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  detailText: string;
  // Added fields for data-driven UI
  role?: string;
  era?: string;
  tags?: string[];
  category?: '革命先辈' | '历届乡贤' | '优秀后生'; // 名人堂分类
}

export interface SpecialItem {
  id: string;
  title: string;
  category: '特产' | '活动' | '美食'; // 原始分类（保留兼容）
  priceOrTime: string;
  imageUrl: string;
  description: string;
  // Added fields for data-driven UI
  rating?: string;
  tags?: string[];
  subcategory?: '文化民俗' | '风物特产'; // 风物志二级分类
}

// --- Simplified ANP (Agent Network Protocol) for Intranet ---

export type AgentID = 'A' | 'B' | 'C' | 'D' | 'USER';

export interface ANPMessage {
  id: string;
  timestamp: number;
  source: AgentID;
  target: AgentID | 'BROADCAST';
  type: 'REQUEST' | 'RESPONSE' | 'EVENT' | 'ERROR';
  action: string; // e.g., "call_tool", "update_context"
  payload: any;
}

// The Shared Blackboard (Data Pool) managed by Agent D
export interface SharedContext {
  userSession: {
    currentSpot?: string;
    lastIntent?: string;
    history: string[];
  };
  environment: {
    weather?: string;
    activeEvents?: string[];
  };
  systemStatus: {
    agentHealth: Record<string, 'online' | 'busy' | 'offline'>;
    pendingTasks: number;
  };
}

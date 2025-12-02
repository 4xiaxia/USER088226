
// Configuration constants
// Extracted for clarity and easier environment management

export const AI_CONFIG = {
  WEBHOOK_URL: 'https://api.day.app/p2CPtgzAMNGQCqQYEz86AV', // Bark notification endpoint
  
  SILICON_FLOW: {
    BASE_URL: 'https://api.siliconflow.cn/v1',
    API_KEY: process.env.SILICON_FLOW_API_KEY || 'sk-cjqstblrzdcgwpayffghxnzletgcckesnysskzdfnwdhiutg',
    MODELS: {
      // Updated to DeepSeek-R1-Distill-Qwen-7B for better reasoning capability
      TEXT: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', 
      REASONING: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
      IMAGE: 'Kwai-Kolors/Kolors',
    }
  },
  ZHIPU: {
    BASE_URL: 'https://open.bigmodel.cn/api/paas/v4',
    API_KEY: process.env.ZHIPU_API_KEY || 'a049afdafb1b41a0862cdc1d73d5d6eb.YuGYXVGRQEUILpog',
    MODELS: {
      // Free and fast models
      TEXT: 'GLM-4-Flash',
      VISION: 'GLM-4V-Flash' // Supports image understanding
    }
  },
  MINIMAX: {
    BASE_URL: 'https://api.minimax.chat/v1',
    // Fallback to hardcoded values if process.env injection fails
    API_KEY: process.env.MINIMAX_API_KEY || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJscyBsbGx5eXlzc3MiLCJVc2VyTmFtZSI6ImxzIGxsbHl5eXNzcyIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTE4Nzk2Mjk4NDAwNTY3NDkyIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkxODc5NjI5ODM5NjM3MzE4OCIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6ImxsbC55eXkuc3NzLjc3QGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTIwIDE1OjUxOjQwIiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.Nvc6I_x53hQk_OSankcxU1uyb2Cek9-EhZoNO44mS1wsyiR2TNiof8FA9JmELCEBjnkomCCho1cxseEb098hAebTNklqRL5PlVl4rxaj4spAZt-1oloxojSSU3g-NoiurR-4dPcSMp43KOp0mc3Ci_piLylbxOG9H2WT3iN4Eaaj_558q7DgsbmpwLmpf3vOiy_j_qBEF5QztVN4gF8xhPasjXWAmT_hox7fmjTubn4PcQMbaAHKVBj95uP8l4VwbrjRpLaajyMIKHGoTS_0JAhmBH2psw49I2CouBNLggZGsOQS9XLepjX7euCtrMPJC7V0kPsUGJuxddLnYLrzJw', 
    GROUP_ID: process.env.MINIMAX_GROUP_ID || '1918796298396373188', 
    MODELS: {
      TEXT: 'abab6.5s-chat',
      AUDIO: 'speech-01-turbo'
    }
  }
};

export const AMAP_CONFIG = {
  MCP_URL: 'https://mcp.api-inference.modelscope.net/d19a443b23994d/mcp'
};

/**
 * Google Sheets 数据同步服务
 * 从 Google Sheets 导出的 CSV 读取数据，支持本地缓存
 */

import { Route, Celebrity, SpecialItem } from '../types';

// 配置：替换为你的 Google Sheet ID
const GOOGLE_SHEET_ID = 'YOUR_SHEET_ID_HERE';

// CSV 导出 URL（替换为实际 Sheet ID）
const getSheetURL = (sheetName: string) => 
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

// 缓存管理
const CACHE_KEY_ROUTES = 'village_guide_routes_cache';
const CACHE_KEY_CELEBRITIES = 'village_guide_celebrities_cache';
const CACHE_KEY_SPECIALS = 'village_guide_specials_cache';
const CACHE_TIMESTAMP_KEY = 'village_guide_cache_timestamp';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24小时

/**
 * 从缓存读取数据
 */
const getCachedData = (key: string): any | null => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_TTL) {
      // 缓存已过期
      clearCache();
      return null;
    }
    
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error('Cache read error:', e);
    return null;
  }
};

/**
 * 写入缓存
 */
const setCachedData = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.error('Cache write error:', e);
  }
};

/**
 * 清除所有缓存
 */
export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY_ROUTES);
  localStorage.removeItem(CACHE_KEY_CELEBRITIES);
  localStorage.removeItem(CACHE_KEY_SPECIALS);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
};

/**
 * 解析 CSV 行
 */
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // 跳过下一个引号
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

/**
 * 从 CSV 文本解析路由数据
 */
const parseRoutesFromCSV = (csv: string): Route[] => {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const routes: Route[] = [];
  
  // 按 name 分组景点
  const groupedByRoute: { [key: string]: Route } = {};
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 3) continue;
    
    const row: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    const routeName = row.name || '';
    if (!routeName) continue;
    
    // 初始化路线
    if (!groupedByRoute[routeName]) {
      groupedByRoute[routeName] = {
        name: routeName,
        category: (row.category as any) || '历史文化',
        description: row.description || '',
        imagePrompt: row.imagePrompt || '',
        imageUrl: row.imageUrl || '',
        spots: []
      };
    }
    
    // 添加景点
    if (row.spotId && row.spotName) {
      groupedByRoute[routeName].spots.push({
        id: row.spotId,
        name: row.spotName,
        coord: row.spotCoord || '118.2,25.2',
        distance: row.spotDistance || '',
        intro_short: row.spotIntroShort || '',
        intro_txt: row.spotIntroTxt || '',
        imagePrompt: row.spotImagePrompt || '',
        imageUrl: row.spotImageUrl || '',
        position: row.spotPosition ? (() => {
          try {
            return JSON.parse(row.spotPosition);
          } catch {
            return { top: '50%', left: '50%' };
          }
        })() : { top: '50%', left: '50%' },
        tags: row.spotTags ? row.spotTags.split(',').map(t => t.trim()) : [],
        postcardText: row.spotPostcardText || '',
        audioUrl: row.spotAudioUrl || ''
      });
    }
  }
  
  return Object.values(groupedByRoute);
};

/**
 * 从 CSV 文本解析名人数据
 */
const parseCelebritiesFromCSV = (csv: string): Celebrity[] => {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const celebrities: Celebrity[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;
    
    const row: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    celebrities.push({
      id: row.id || `cel_${i}`,
      name: row.name || '',
      title: row.title || '',
      description: row.description || '',
      imageUrl: row.imageUrl || '',
      detailText: row.detailText || '',
      role: row.role || '',
      era: row.era || '',
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : []
    });
  }
  
  return celebrities;
};

/**
 * 从 CSV 文本解析特产数据
 */
const parseSpecialsFromCSV = (csv: string): SpecialItem[] => {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const specials: SpecialItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;
    
    const row: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    specials.push({
      id: row.id || `spec_${i}`,
      title: row.title || '',
      category: row.category || '',
      priceOrTime: row.priceOrTime || '',
      imageUrl: row.imageUrl || '',
      description: row.description || '',
      rating: row.rating || '⭐⭐⭐⭐',
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : []
    });
  }
  
  return specials;
};

/**
 * 从 Google Sheets 获取路由数据
 */
export const getRoutesFromSheet = async (forceRefresh = false): Promise<Route[]> => {
  try {
    // 尝试读取缓存
    if (!forceRefresh) {
      const cached = getCachedData(CACHE_KEY_ROUTES);
      if (cached) {
        console.log('✅ 从本地缓存读取路由数据');
        return cached;
      }
    }
    
    // 从 Google Sheets 获取
    console.log('⬇️ 从 Google Sheets 同步路由数据...');
    const response = await fetch(getSheetURL('routes'));
    const csv = await response.text();
    
    const routes = parseRoutesFromCSV(csv);
    setCachedData(CACHE_KEY_ROUTES, routes);
    
    console.log(`✅ 同步成功：${routes.length} 条路由`);
    return routes;
  } catch (error) {
    console.warn('⚠️ Google Sheets 同步失败，尝试读取缓存...', error);
    const cached = getCachedData(CACHE_KEY_ROUTES);
    if (cached) return cached;
    
    console.error('❌ 缓存也不存在，返回空数据');
    return [];
  }
};

/**
 * 从 Google Sheets 获取名人数据
 */
export const getCelebritiesFromSheet = async (forceRefresh = false): Promise<Celebrity[]> => {
  try {
    if (!forceRefresh) {
      const cached = getCachedData(CACHE_KEY_CELEBRITIES);
      if (cached) {
        console.log('✅ 从本地缓存读取名人数据');
        return cached;
      }
    }
    
    console.log('⬇️ 从 Google Sheets 同步名人数据...');
    const response = await fetch(getSheetURL('celebrities'));
    const csv = await response.text();
    
    const celebrities = parseCelebritiesFromCSV(csv);
    setCachedData(CACHE_KEY_CELEBRITIES, celebrities);
    
    console.log(`✅ 同步成功：${celebrities.length} 位名人`);
    return celebrities;
  } catch (error) {
    console.warn('⚠️ Google Sheets 同步失败，尝试读取缓存...', error);
    const cached = getCachedData(CACHE_KEY_CELEBRITIES);
    if (cached) return cached;
    
    return [];
  }
};

/**
 * 从 Google Sheets 获取特产数据
 */
export const getSpecialsFromSheet = async (forceRefresh = false): Promise<SpecialItem[]> => {
  try {
    if (!forceRefresh) {
      const cached = getCachedData(CACHE_KEY_SPECIALS);
      if (cached) {
        console.log('✅ 从本地缓存读取特产数据');
        return cached;
      }
    }
    
    console.log('⬇️ 从 Google Sheets 同步特产数据...');
    const response = await fetch(getSheetURL('specials'));
    const csv = await response.text();
    
    const specials = parseSpecialsFromCSV(csv);
    setCachedData(CACHE_KEY_SPECIALS, specials);
    
    console.log(`✅ 同步成功：${specials.length} 个特产`);
    return specials;
  } catch (error) {
    console.warn('⚠️ Google Sheets 同步失败，尝试读取缓存...', error);
    const cached = getCachedData(CACHE_KEY_SPECIALS);
    if (cached) return cached;
    
    return [];
  }
};

/**
 * 一次性获取所有数据
 */
export const getAllDataFromSheet = async (forceRefresh = false) => {
  const [routes, celebrities, specials] = await Promise.all([
    getRoutesFromSheet(forceRefresh),
    getCelebritiesFromSheet(forceRefresh),
    getSpecialsFromSheet(forceRefresh)
  ]);
  
  return { routes, celebrities, specials };
};

/**
 * 获取缓存状态信息
 */
export const getCacheStatus = () => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) {
    return { cached: false, message: '暂无缓存' };
  }
  
  const age = Date.now() - parseInt(timestamp);
  const hours = Math.floor(age / (60 * 60 * 1000));
  const minutes = Math.floor((age % (60 * 60 * 1000)) / (60 * 1000));
  
  const isValid = age < CACHE_TTL;
  return {
    cached: true,
    valid: isValid,
    message: isValid 
      ? `${hours}小时${minutes}分钟前更新`
      : '缓存已过期'
  };
};

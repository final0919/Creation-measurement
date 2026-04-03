import React, { useState, useEffect, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from './components/Icons';
import { cn } from './lib/utils';

// --- Types ---
type View = 'home' | 'dashboard' | 'contact-config' | 'publish' | 'login';

interface Creation {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  image: string;
  url: string;
  icon: keyof typeof Icons;
  createdAt: string;
  updatedAt?: string;
}

interface ContactConfig {
  title: string;
  description: string;
  email: string;
  xiaohongshu: string;
  qrCode?: string;
  updatedAt: string;
}

// --- API Helpers ---
const API_BASE = '/api';

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'token': token } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};


// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[200px] justify-center",
        type === 'success' ? "bg-secondary text-on-secondary" : "bg-red-500 text-white"
      )}
    >
      {type === 'success' ? <Icons.CheckCircle className="w-5 h-5" /> : <Icons.AlertCircle className="w-5 h-5" />}
      {message}
    </motion.div>
  );
};

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-surface rounded-3xl p-8 shadow-2xl space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-headline font-bold text-on-surface">{title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-4 pt-2">
            <button 
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              取消
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
            >
              确认删除
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Sidebar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => (
  <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-surface-container-high flex flex-col p-6 space-y-4 editorial-shadow rounded-r-3xl">
    <div className="mb-8 px-4 flex items-center gap-3">
      <Icons.BatteryCharging className="text-primary w-8 h-8 animate-battery-pulse" />
      <div>
        <h1 className="text-lg font-black text-primary">管理控制台</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Editorial Vitality</p>
      </div>
    </div>
    <nav className="flex-1 space-y-2">
      <button 
        onClick={() => setView('dashboard')}
        className={cn(
          "w-full flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 text-sm font-bold uppercase tracking-widest",
          currentView === 'dashboard' ? "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface/50 hover:translate-x-1"
        )}
      >
        <Icons.LayoutDashboard className="w-5 h-5" />
        <span>链接管理</span>
      </button>
      <button 
        onClick={() => setView('publish')}
        className={cn(
          "w-full flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 text-sm font-bold uppercase tracking-widest",
          currentView === 'publish' ? "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface/50 hover:translate-x-1"
        )}
      >
        <Icons.PlusCircle className="w-5 h-5" />
        <span>发布新链接</span>
      </button>
      <button 
        onClick={() => setView('contact-config')}
        className={cn(
          "w-full flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 text-sm font-bold uppercase tracking-widest",
          currentView === 'contact-config' ? "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface/50 hover:translate-x-1"
        )}
      >
        <Icons.Settings className="w-5 h-5" />
        <span>联系方式配置</span>
      </button>
    </nav>
    <div className="mt-auto pt-6 border-t border-outline-variant/10 flex items-center gap-4 px-4">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container/30 flex items-center justify-center">
        <Icons.BatteryCharging className="text-primary w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-primary">造物测</p>
        <p className="text-[10px] text-on-surface-variant">系统管理员</p>
      </div>
    </div>
    <button 
      onClick={() => setView('home')}
      className="mt-4 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
    >
      返回首页
    </button>
    <button 
      onClick={() => {
        localStorage.removeItem('admin_token');
        window.location.reload();
      }}
      className="mt-2 text-xs font-bold text-red-500 hover:underline"
    >
      退出登录
    </button>
  </aside>
);

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

const ContactModal = ({ isOpen, onClose, config }: { isOpen: boolean, onClose: () => void, config: ContactConfig }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-on-surface/20 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          <div className="flex-1 p-12 lg:p-16 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                <Icons.Mail className="w-4 h-4" />
                联系我们
              </div>
              <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight whitespace-pre-line">
                {config.title}
              </h2>
              <p className="text-on-surface-variant leading-relaxed max-w-xs">
                {config.description}
              </p>
            </div>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <div className="text-on-surface-variant text-[10px] mb-1 uppercase tracking-tighter font-bold">官方邮箱</div>
                <div className="text-2xl font-headline font-medium text-on-surface group-hover:text-primary transition-colors">{config.email}</div>
                <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"></div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-on-surface-variant text-[10px] mb-1 uppercase tracking-tighter font-bold">小红书号</div>
                <div className="text-2xl font-headline font-medium text-on-surface group-hover:text-primary transition-colors">{config.xiaohongshu}</div>
                <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"></div>
              </div>
            </div>
            <div className="pt-4">
              <a 
                href={`mailto:${config.email}`}
                className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                发送邮件
              </a>
            </div>
          </div>
          <div className="w-full md:w-96 bg-surface-container p-12 lg:p-16 flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-primary-container/20 rounded-xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              <div className="relative p-6 bg-surface-container-lowest rounded-xl shadow-inner overflow-hidden">
                <div className="w-40 h-40 bg-on-surface/5 flex items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/30">
                  {config.qrCode ? (
                    <img src={config.qrCode} alt="QR Code" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <Icons.BatteryCharging className="w-12 h-12 text-primary/20" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/20 transition-colors"
          >
            <Icons.X className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Views ---

const HomeView = ({ onContactClick, searchQuery, setSearchQuery, creations, onLogoClick }: { 
  onContactClick: () => void, 
  searchQuery: string, 
  setSearchQuery: (q: string) => void,
  creations: Creation[],
  onLogoClick: () => void
}) => {
  const filteredProducts = creations.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 h-20 gap-8">
          <div 
            className="flex items-center gap-3 cursor-default select-none active:scale-95 transition-transform shrink-0"
            onClick={onLogoClick}
          >
            <Icons.BatteryCharging className="text-primary w-8 h-8 animate-battery-pulse" />
            <span className="text-2xl font-bold tracking-tighter text-primary hidden sm:inline">造物测</span>
          </div>
          
          <div className="flex-1 max-w-xl relative flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/10 focus-within:ring-2 focus-within:ring-primary-container transition-all">
            <Icons.Search className="absolute left-4 text-on-surface-variant w-4 h-4" />
            <input 
              className="w-full bg-transparent border-none focus:ring-0 pl-11 pr-4 py-2 text-sm font-medium text-on-surface placeholder:text-outline" 
              placeholder="搜索" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={onContactClick}
              className="bg-primary text-on-primary font-bold hover:scale-105 active:scale-95 transition-all px-6 py-2 rounded-full shadow-lg shadow-primary/20 text-sm"
            >
              联系我们
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <section className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.a 
                key={product.id}
                href={ensureAbsoluteUrl(product.url)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden editorial-shadow hover:-translate-y-2 transition-all duration-400 block"
              >
                <div className="overflow-hidden aspect-[4/5] bg-surface-container-low flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span 
                      className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                      style={{ backgroundColor: product.tagColor || '#eee', color: '#fff' }}
                    >
                      {product.tag}
                    </span>
                    {(() => {
                      const IconComponent = Icons[product.icon as keyof typeof Icons] || Icons.BatteryCharging;
                      return <IconComponent className="text-primary w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">{product.title}</h3>
                    <p className="text-on-surface-variant text-sm mt-2 leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    立即访问 <Icons.ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 space-y-6">
              <div className="bg-surface-container-low p-10 rounded-3xl inline-block editorial-shadow">
                <Icons.BatteryCharging className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                <p className="text-on-surface-variant font-medium">未找到相关造物，请尝试其他关键词。</p>
                <p className="text-[10px] text-on-surface-variant/60 mt-2 uppercase tracking-widest font-bold">No Creations Found</p>
              </div>
              <div className="text-[10px] text-on-surface-variant/40 flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span>云端同步已就绪</span>
              </div>
            </div>
          )}
        </section>

      <div className="flex justify-center py-12">
        <div className="flex items-center gap-6">
          <div className="h-px w-12 bg-outline-variant opacity-20"></div>
          <Icons.BatteryCharging className="text-primary-container w-10 h-10 fill-current" />
          <div className="h-px w-12 bg-outline-variant opacity-20"></div>
        </div>
      </div>
    </main>
  </div>
);
};

const DashboardView = ({ 
  onPublishClick, 
  creations, 
  onDelete, 
  onEdit,
  onSeed,
  isSaving
}: { 
  onPublishClick: () => void, 
  creations: Creation[],
  onDelete: (id: string) => void,
  onEdit: (creation: Creation) => void,
  onSeed: () => void,
  isSaving: boolean
}) => (
  <div className="ml-72 p-12 min-h-screen space-y-12">
    <header className="flex justify-between items-end">
      <div>
        <h2 className="text-5xl font-headline font-extrabold text-primary tracking-tight">链接概览</h2>
        <p className="text-on-surface-variant mt-2 font-medium">欢迎回来，这是您目前的数字生态看板。</p>
      </div>
      <div className="flex gap-4">
        {creations.length === 0 && (
          <button 
            onClick={onSeed}
            disabled={isSaving}
            className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Icons.Zap className="w-4 h-4" />
            导入演示数据
          </button>
        )}
        <button 
          onClick={onPublishClick}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Icons.PlusCircle className="w-4 h-4" />
          发布新链接
        </button>
      </div>
    </header>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: '已发布总数', value: creations.length.toString(), sub: '实时统计', icon: Icons.CheckCircle, border: 'border-primary' },
        { label: '最近更新', value: creations.length > 0 ? creations[0].title : '-', sub: creations.length > 0 ? '最新发布' : '暂无内容', icon: Icons.TrendingUp, border: 'border-secondary' },
      ].map((stat, i) => (
        <div key={i} className={cn("bg-surface-container-lowest p-8 rounded-3xl editorial-shadow flex flex-col justify-between h-48 border-l-4", stat.border)}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span>
            <stat.icon className="text-primary w-6 h-6" />
          </div>
          <div>
            <span className="text-4xl font-headline font-extrabold text-on-surface truncate block max-w-full">{stat.value}</span>
            <p className={cn("text-xs font-medium mt-1", i === 1 ? "text-on-surface-variant" : "text-secondary")}>{stat.sub}</p>
          </div>
        </div>
      ))}
    </section>

    <section className="bg-surface-container-low rounded-3xl overflow-hidden flex flex-col editorial-shadow">
      <div className="px-8 py-6 flex justify-between items-center bg-surface-container/50">
        <h3 className="font-headline font-bold text-xl">已发布链接</h3>
        <div className="flex items-center gap-4 bg-surface-container-lowest px-6 py-2 rounded-full border border-outline-variant/10">
          <Icons.Search className="text-on-surface-variant w-4 h-4" />
          <input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-on-surface-variant/50" placeholder="搜索链接名称..." type="text"/>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container/30 border-b border-outline-variant/5">
              <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">名称</th>
              <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">标签</th>
              <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {creations.map((row, i) => (
              <tr key={row.id} className="hover:bg-surface-container-highest transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
                      <img src={row.image} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{row.title}</p>
                      <p className="text-xs text-on-surface-variant truncate max-w-[200px]">{row.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: row.tagColor || '#eee', color: '#fff' }}
                    >
                      {row.tag}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(row)}
                      className="p-2 rounded-lg hover:bg-primary-container/20 text-primary transition-transform active:scale-90"
                    >
                      <Icons.Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(row.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-transform active:scale-90"
                    >
                      <Icons.Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-6 bg-surface-container/20 flex justify-between items-center">
        <span className="text-xs text-on-surface-variant font-medium">显示 1-{creations.length} 共 {creations.length} 条链接</span>
      </div>
    </section>
  </div>
);

const ContactConfigView = ({ 
  config, 
  onSave,
  isSaving
}: { 
  config: ContactConfig, 
  onSave: (newConfig: ContactConfig) => void,
  isSaving: boolean
}) => {
  const [formData, setFormData] = useState<ContactConfig>(config);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData({ ...formData, qrCode: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="ml-72 p-12 min-h-screen space-y-16">
      <header className="flex items-end justify-between">
        <div className="space-y-2">
          <span className="inline-block py-1 px-3 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full tracking-widest uppercase">Global Settings</span>
          <h2 className="text-5xl font-headline font-bold text-on-surface tracking-tighter">联系方式配置</h2>
        </div>
        <div className="text-right max-w-xs">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            在此配置您的官方社交资产与联系通道。这些信息将直接呈现于页面的交互弹窗中，确保访客能快速建立连接。
          </p>
        </div>
      </header>

      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 editorial-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Icons.BatteryCharging className="w-4 h-4" />
              二维码资产
            </h3>
            <div className="aspect-square w-full rounded-2xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-4 group-hover:bg-surface-container transition-colors duration-400 relative">
              <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                {formData.qrCode ? (
                  <img src={formData.qrCode} alt="QR Code" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Icons.BatteryCharging className="w-16 h-16 text-primary/10" />
                )}
              </div>
              <div className="space-y-4 w-full px-8 flex flex-col items-center">
                <label className="cursor-pointer bg-primary text-on-primary px-6 py-2 rounded-full text-[10px] font-bold shadow-lg hover:scale-105 transition-transform">
                  上传二维码图片
                  <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} />
                </label>
                <input 
                  type="text" 
                  placeholder="或者输入二维码图片 URL" 
                  className="w-full bg-surface-container-high rounded-full px-4 py-2 text-[10px] focus:ring-1 focus:ring-primary outline-none"
                  value={formData.qrCode || ''}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                />
              </div>
            </div>
            <p className="mt-4 text-[10px] text-on-surface-variant text-center leading-relaxed font-bold">支持直接上传或通过 URL 链接替换二维码图片。建议尺寸 500x500px。</p>
          </div>
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <Icons.Info className="w-4 h-4" />
              设计建议
            </h3>
            <p className="text-xs text-on-surface-variant leading-loose font-medium">
              为了保持“造物测”品牌的一致性，建议二维码背景使用淡米色 <span className="font-mono text-primary">#F7F7F2</span>。文案细节应简洁明了，避免过长的描述干扰用户的直觉体验。
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 editorial-shadow">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
              <Icons.Edit3 className="w-4 h-4" />
              弹窗交互文案
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">弹窗标题 (支持换行)</label>
                <textarea 
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all resize-none" 
                  placeholder="输入弹窗主标题，可直接回车换行" 
                  rows={2}
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">详情说明</label>
                <textarea 
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all resize-none" 
                  placeholder="输入引导关注或业务介绍文案..." 
                  rows={3} 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">官方邮箱</label>
                  <div className="relative">
                    <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-4 h-4" />
                    <input 
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all" 
                      type="email" 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">小红书号</label>
                  <div className="relative">
                    <Icons.Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-4 h-4" />
                    <input 
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all" 
                      type="text" 
                      value={formData.xiaohongshu || ''}
                      onChange={(e) => setFormData({ ...formData, xiaohongshu: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-end gap-4 border-t border-surface-variant/50 mt-8">
                <button 
                  className="px-8 py-3 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors" 
                  type="button"
                  onClick={() => setFormData(config)}
                >
                  放弃更改
                </button>
                <button 
                  className="px-10 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-all duration-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : <Icons.CheckCircle className="w-4 h-4" />}
                  {isSaving ? '同步中...' : '发布并同步'}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-surface-container-high/80 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface">实时预览效果</h3>
              <span className="text-[8px] text-primary bg-primary/10 px-2 py-0.5 rounded uppercase font-bold">Frontend View</span>
            </div>
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <h4 className="text-xl font-headline font-bold text-on-surface mb-2">{formData.title}</h4>
              <p className="text-xs text-on-surface-variant mb-6 px-4">{formData.description}</p>
              <div className="w-32 h-32 bg-surface rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-outline-variant/20 overflow-hidden">
                {formData.qrCode ? (
                  <img src={formData.qrCode} alt="QR Code" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <Icons.BatteryCharging className="w-10 h-10 text-primary/10" />
                )}
              </div>
              <div className="flex gap-4 w-full border-t border-surface pt-4">
                <div className="flex-1">
                  <p className="text-[8px] uppercase tracking-tighter text-outline-variant font-bold">Email</p>
                  <p className="text-[10px] font-bold text-primary truncate">{formData.email}</p>
                </div>
                <div className="flex-1 border-l border-surface pl-4">
                  <p className="text-[8px] uppercase tracking-tighter text-outline-variant font-bold">Xiaohongshu</p>
                  <p className="text-[10px] font-bold text-primary truncate">{formData.xiaohongshu}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const PublishView = ({ 
  onSave, 
  onCancel, 
  initialData,
  isSaving
}: { 
  onSave: (data: Partial<Creation>) => void, 
  onCancel: () => void,
  initialData?: Creation | null,
  isSaving: boolean
}) => {
  const [formData, setFormData] = useState<Partial<Creation>>(initialData || {
    title: '',
    description: '',
    tag: '',
    tagColor: '#6366f1',
    image: '',
    url: '',
    icon: 'BatteryCharging'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData({ ...formData, image: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="ml-72 p-12 min-h-screen space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-headline font-extrabold text-primary tracking-tight">
            {initialData ? '编辑内容' : '发布新内容'}
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-md font-medium">创建并发布新的测试链接，通过视觉引导与参数配置构建完整的用户体验流。</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="px-8 py-3 rounded-full border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-surface-container-high transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-10 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? '保存中...' : (initialData ? '保存修改' : '保存并发布')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-3xl editorial-shadow">
            <div className="flex items-center gap-2 mb-8">
              <Icons.Info className="text-primary w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">基本信息</h3>
            </div>
            <div className="space-y-8">
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 ml-1">链接标题</label>
                <input 
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 text-2xl font-bold focus:border-primary transition-all placeholder:text-outline/30" 
                  placeholder="输入极简且具吸引力的标题..." 
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 ml-1">标签名称</label>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 text-on-surface focus:border-primary transition-all placeholder:text-outline/30" 
                    placeholder="创意, 交互, 极简..." 
                    type="text"
                    value={formData.tag || ''}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 ml-1">标签颜色</label>
                  <div className="flex items-center gap-4 py-3">
                    <input 
                      className="w-12 h-12 rounded-lg border-none cursor-pointer p-0" 
                      type="color"
                      value={formData.tagColor || '#6366f1'}
                      onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                    />
                    <span className="text-sm font-mono text-on-surface-variant">{formData.tagColor || '#6366f1'}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 ml-1">跳转链接 (URL)</label>
                <div className="relative">
                  <Icons.Link className="absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 pl-8 text-on-surface focus:border-primary transition-all placeholder:text-outline/30" 
                    placeholder="https://example.com/test-link" 
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-3xl editorial-shadow">
            <div className="flex items-center gap-2 mb-8">
              <Icons.FileText className="text-primary w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">详细介绍</h3>
            </div>
            <textarea 
              className="w-full bg-surface-container-low border-none rounded-2xl p-6 text-on-surface-variant focus:ring-2 focus:ring-primary-container/30 transition-all resize-none min-h-[240px]" 
              placeholder="描述此链接背后的设计意图与核心体验..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-surface-container-high p-8 rounded-3xl editorial-shadow">
            <div className="flex items-center gap-2 mb-8">
              <Icons.ImageIcon className="text-primary w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">封面图片</h3>
            </div>
            <div className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-container-highest border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <div className="text-center p-6 z-10 w-full">
                <Icons.Upload className="w-12 h-12 text-on-surface-variant mb-4 group-hover:scale-110 transition-transform mx-auto" />
                <label className="block w-full cursor-pointer">
                  <span className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg inline-block mb-4">选择图片</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <input 
                  type="text" 
                  placeholder="或者输入图片 URL" 
                  className="w-full bg-surface/50 rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-center"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <p className="text-[10px] text-on-surface-variant mt-4 uppercase font-bold">Recommended: 1200x1200px</p>
              </div>
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity flex items-center justify-center bg-surface-container-highest">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <img src="https://picsum.photos/seed/texture/600/600" alt="Texture" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-3xl editorial-shadow">
            <div className="flex items-center gap-2 mb-8">
              <Icons.Tag className="text-primary w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">图标配置</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['BatteryCharging', 'Zap', 'Cpu', 'Globe', 'Layers', 'Layout', 'Smartphone', 'Monitor'].map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => setFormData({ ...formData, icon: iconName as any })}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center transition-all",
                    formData.icon === iconName ? "bg-primary text-on-primary shadow-lg" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  {(() => {
                    const IconComponent = Icons[iconName as keyof typeof Icons] || Icons.BatteryCharging;
                    return <IconComponent className="w-6 h-6" />;
                  })()}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const LoginView = ({ onLogin, isLoggingIn }: { onLogin: (pass: string) => void, isLoggingIn: boolean }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 6) {
      onLogin(password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-lowest p-10 rounded-3xl editorial-shadow space-y-8"
      >
        <div className="text-center space-y-2">
          <Icons.BatteryCharging className="w-12 h-12 text-primary mx-auto animate-battery-pulse" />
          <h2 className="text-2xl font-headline font-bold text-on-surface">管理员验证</h2>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Identity Verification Required</p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">访问密码</label>
              <input 
                className={cn(
                  "w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 transition-all",
                  error ? "ring-2 ring-red-500 animate-shake" : "focus:ring-primary-container"
                )}
                type="password" 
                placeholder="请输入管理员密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn && <Icons.Loader2 className="w-5 h-5 animate-spin" />}
              {isLoggingIn ? '验证中...' : '验证并进入'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-[10px] text-on-surface-variant/60 leading-relaxed">
          注意：此区域仅限管理员访问。<br/>
          如果您不是管理员，请返回首页。
        </p>
      </motion.div>
    </div>
  );
};

// --- Error Boundary ---
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  public state: { hasError: boolean, error: any } = { hasError: false, error: null };
  public props: { children: React.ReactNode };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "出错了，请稍后再试。";

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-6">
          <div className="bg-surface-container-lowest p-10 rounded-3xl editorial-shadow max-w-md w-full text-center space-y-6">
            <Icons.AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-headline font-bold text-on-surface">系统错误</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [editingCreation, setEditingCreation] = useState<Creation | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [contactConfig, setContactConfig] = useState<ContactConfig>({
    title: '联系造物者',
    description: '扫描二维码关注造物测官方小红书，获取更多关于设计美学与造物灵感的深度资讯。',
    email: 'hello@zaowuce.design',
    xiaohongshu: 'zaowu_official',
    updatedAt: new Date().toISOString()
  });

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAdmin(!!token);
    if (token && view === 'login') {
      setView('dashboard');
    }
  }, [view]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creationsData, settingsData] = await Promise.all([
          apiFetch('/creations'),
          apiFetch('/settings')
        ]);
        setCreations(creationsData);
        setContactConfig(prev => ({ ...prev, ...settingsData }));
      } catch (error) {
        console.error('Fetch error:', error);
        setToast({ message: '数据加载失败，请检查网络连接', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (pass: string) => {
    setIsSaving(true);
    try {
      const result = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ password: pass })
      });
      localStorage.setItem('admin_token', result.token);
      setIsAdmin(true);
      setToast({ message: '登录成功！', type: 'success' });
      setView('dashboard');
    } catch (error: any) {
      setToast({ message: '登录失败：' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCreation = async (data: Partial<Creation>) => {
    if (!data.title || !data.description || !data.tag || !data.url) {
      setToast({ message: '请填写所有必填字段', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      if (editingCreation) {
        const updated = await apiFetch(`/creations/${editingCreation.id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        setCreations(prev => prev.map(c => c.id === updated.id ? updated : c));
        setToast({ message: '作品更新成功！', type: 'success' });
      } else {
        const created = await apiFetch('/creations', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        setCreations(prev => [created, ...prev]);
        setToast({ message: '新作品发布成功！', type: 'success' });
      }
      setView('dashboard');
      setEditingCreation(null);
    } catch (error: any) {
      setToast({ message: '操作失败：' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCreation = async (id: string) => {
    try {
      await apiFetch(`/creations/${id}`, { method: 'DELETE' });
      setCreations(prev => prev.filter(c => c.id !== id));
      setToast({ message: '作品已成功删除', type: 'success' });
      setConfirmDelete(null);
    } catch (error: any) {
      setToast({ message: '删除失败：' + error.message, type: 'error' });
    }
  };

  const handleSaveContact = async (newConfig: ContactConfig) => {
    setIsSaving(true);
    try {
      const updated = await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify(newConfig)
      });
      setContactConfig(updated);
      setToast({ message: '联系方式配置已同步！', type: 'success' });
    } catch (error: any) {
      setToast({ message: '同步失败：' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoClick = () => {
    setSecretClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setView(isAdmin ? 'dashboard' : 'login');
        return 0;
      }
      setTimeout(() => setSecretClicks(0), 2000);
      return next;
    });
  };

  const seedDemoData = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      const demoCreations = [
        {
          title: '造物测 1.0',
          description: '这是一个演示作品，展示了造物测的核心理念：将设计美学与实用功能完美结合。',
          tag: '演示',
          tagColor: '#6366f1',
          image: 'https://picsum.photos/seed/zaowu1/800/1000',
          url: 'https://zaowuce.design',
          icon: 'BatteryCharging'
        },
        {
          title: '灵感看板',
          description: '汇集全球顶尖设计师的创意灵感，为您提供源源不断的创作动力。',
          tag: '灵感',
          tagColor: '#ec4899',
          image: 'https://picsum.photos/seed/zaowu2/800/1000',
          url: 'https://zaowuce.design/inspiration',
          icon: 'Zap'
        }
      ];
      for (const c of demoCreations) {
        const created = await apiFetch('/creations', {
          method: 'POST',
          body: JSON.stringify(c)
        });
        setCreations(prev => [created, ...prev]);
      }
      setToast({ message: '演示数据已成功导入！', type: 'success' });
    } catch (error: any) {
      setToast({ message: '导入失败：' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const LoadingView = () => (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-6">
        <Icons.BatteryCharging className="w-16 h-16 text-primary animate-battery-pulse" />
        <div className="space-y-2 text-center">
          <p className="text-on-surface font-bold text-lg tracking-tight">正在加载造物空间...</p>
          <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold opacity-50">Synchronizing Digital Assets</p>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="font-sans selection:bg-primary-container selection:text-on-primary-container">
        {isAdmin && view !== 'home' && view !== 'login' && <Sidebar currentView={view as any} setView={setView} />}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingView />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'home' && (
                <HomeView 
                  onContactClick={() => setIsContactOpen(true)} 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  creations={creations}
                  onLogoClick={handleLogoClick}
                />
              )}
              {view === 'login' && (
                <LoginView 
                  onLogin={handleLogin} 
                  isLoggingIn={isSaving}
                />
              )}
              {isAdmin && view === 'dashboard' && (
                <DashboardView 
                  onPublishClick={() => { setEditingCreation(null); setView('publish'); }} 
                  creations={creations}
                  onDelete={(id) => setConfirmDelete(id)}
                  onEdit={(c) => { setEditingCreation(c); setView('publish'); }}
                  onSeed={seedDemoData}
                  isSaving={isSaving}
                />
              )}
              {isAdmin && view === 'contact-config' && (
                <ContactConfigView 
                  config={contactConfig}
                  onSave={handleSaveContact}
                  isSaving={isSaving}
                />
              )}
              {isAdmin && view === 'publish' && (
                <PublishView 
                  onSave={handleSaveCreation}
                  onCancel={() => { setEditingCreation(null); setView('dashboard'); }}
                  initialData={editingCreation}
                  isSaving={isSaving}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} config={contactConfig} />
        
        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>

        <ConfirmDialog 
          isOpen={!!confirmDelete}
          title="确认删除"
          message="此操作不可撤销，确定要永久删除这个作品链接吗？"
          onConfirm={() => confirmDelete && handleDeleteCreation(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    </ErrorBoundary>
  );
}

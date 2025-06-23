// src/utils/settingsExport.js
export const generateSettingsReport = (user, settings) => {
  const report = {
    exportDate: new Date().toISOString(),
    account: {
      name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      email: user?.email,
      accountType: user?.is_employer ? 'Employer' : 'Job Seeker',
      memberSince: user?.date_joined
    },
    preferences: {
      theme: settings.theme || 'system',
      notifications: settings.notifications,
      privacy: settings.privacy,
      general: settings.preferences
    },
    metadata: {
      version: '1.0',
      platform: 'TechHub Web',
      userAgent: navigator.userAgent
    }
  };

  return report;
};

export const downloadSettingsReport = (data, filename = 'techhub-settings.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
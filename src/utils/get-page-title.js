import defaultSettings from '@/settings'

const title = defaultSettings.title || 'weather-push'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}`
  }
  return `${title}`
}

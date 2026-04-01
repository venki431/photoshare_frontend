import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const photoshareTheme = {
  dark: false,
  colors: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    'surface-variant': '#F3F4F6',
    primary: '#4F46E5',
    'primary-darken-1': '#EF007A',
    secondary: '#0EA5E9',
    'secondary-darken-1': '#0284C7',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#10B981',
    'on-background': '#111827',
    'on-surface': '#1F2937',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
  },
  variables: {
    'border-color': '#E5E7EB',
    'border-opacity': 1,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'photoshareTheme',
    themes: { photoshareTheme },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      fontWeight: 600,
      letterSpacing: '0',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
      border: true,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
    },
    VChip: {
      rounded: 'lg',
    },
  },
})

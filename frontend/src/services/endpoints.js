export const endpoints = {
  vision: {
    analyzePose: '/api/v1/vision/analyze-pose',
    history: '/api/v1/vision/history',
  },
  knowledge: {
    query: '/api/v1/knowledge/query',
    history: '/api/v1/knowledge/history',
  },
  creative: {
    enrichPrompt: '/api/v1/creative/enrich-prompt',
    generate: '/api/v1/creative/generate',
  },
  orchestrator: {
    process: '/api/v1/orchestrator/process',
  },
  user: {
    profile: '/api/v1/user/profile',
    practice: '/api/v1/user/practice',
  },
}

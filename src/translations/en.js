export const en = {
  // Navigation
  nav: {
    features: 'Features',
    workflow: 'Workflow',
    pricing: 'Pricing',
    faq: 'FAQ',
    joinWaitlist: 'Join waitlist',
  },

  // Hero
  hero: {
    titleLead: 'Computer vision pipeline',
    titleAccent: 'run by an agent',
    subhead: 'Source datasets, train models, evaluate results, and deploy to edge devices—guided by an AI agent that explains every step. Runs locally. Your keys. Your data.',
    primaryCta: 'Join early access',
    secondaryCta: 'See how it works',
    status: 'Early access open · macOS first',
  },

  // Features
  features: {
    title: 'Everything you need to ship computer vision',
    items: [
      {
        title: 'Agent-driven workflow',
        body: "Describe what you want in plain English. The agent plans the steps, picks the right tools, and explains what it's doing at each stage.",
      },
      {
        title: 'Runs on your machine',
        body: 'Training, inference, and your data never leave your computer. The backend, queue, and model store run inside the desktop app.',
      },
      {
        title: 'Bring your own keys',
        body: 'Connect OpenAI, Groq, Gemini, Roboflow, Kaggle, Hugging Face. You pay providers directly. The agent picks the right one per task.',
      },
      {
        title: 'Model marketplace',
        body: 'Start from pretrained detection, classification, and segmentation models. Publish your own to a versioned catalog.',
      },
      {
        title: 'Live training metrics',
        body: 'Queue runs, watch loss and mAP stream in real time, and compare experiments. Fall back to cloud GPUs when local hardware is tight.',
      },
      {
        title: 'Edge deployment',
        body: 'Push models to registered devices, then monitor throughput, latency, and drift from a single production dashboard.',
      },
    ],
  },

  // Workflow
  workflow: {
    title: 'From dataset to deployment',
    subtitle: 'Five stages. One agent. Zero context switching.',
    steps: [
      {
        step: 'Source',
        title: 'Find and stage a dataset',
        body: 'Search Roboflow, Kaggle, and Hugging Face from inside the app. The agent pulls a labelled set, inspects the class balance, and flags gaps before you spend a GPU-hour.',
      },
      {
        step: 'Train',
        title: 'Fine-tune with live metrics',
        body: 'Kick off a run and watch box loss, class loss, and mAP stream in real time. Checkpoints are versioned so you can always roll back to the best epoch.',
      },
      {
        step: 'Evaluate',
        title: 'Review per-class results',
        body: 'The agent reads the actual predictions — not just the exit code — reports mAP per class, and surfaces the weakest examples so you know what to fix.',
      },
      {
        step: 'Deploy',
        title: 'Export and push to a device',
        body: 'Export to Core ML, ONNX, or TensorRT and stage a deploy to a registered edge device. The transfer is verified end to end, not assumed.',
      },
      {
        step: 'Monitor',
        title: 'Watch it in production',
        body: 'Track latency, throughput, and confidence drift per device. When a metric slips, the agent proposes the retrain that would fix it.',
      },
    ],
  },

  // Pricing
  pricing: {
    title: 'Simple, transparent pricing',
    subtitle: 'Start free. Scale when ready.',
    preview: {
      name: 'Preview',
      price: 'Free',
      cadence: 'while in preview',
      tagline: 'The full app while we\'re in public preview.',
      cta: 'Download for macOS',
    },
    pro: {
      name: 'Pro',
      price: 'Coming soon',
      tagline: 'For practitioners shipping models regularly.',
      cta: 'Join the waitlist',
    },
    team: {
      name: 'Team',
      price: 'Custom',
      cadence: 'billed annually',
      tagline: 'Shared catalog and fleet for a team.',
      cta: 'Contact sales',
    },
  },

  // FAQ
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Does my data or my images ever leave my machine?',
        a: 'No. Training, inference, the job queue, and the model store all run inside the app on your computer. The only outbound calls are the ones you configure — to the AI providers whose keys you supply.',
      },
      {
        q: 'What does "bring your own keys" mean in practice?',
        a: 'You paste API keys for the providers you want to use (OpenAI, Groq, Gemini, Hugging Face, Roboflow, and others). VisionCraft uses them on your behalf and you\'re billed by each provider directly. Groq has a free tier that covers most of the agent\'s work.',
      },
      {
        q: 'Do I need a GPU?',
        a: 'It helps for training, but it isn\'t required. You can fall back to cloud GPUs through your own provider or run smaller jobs on local CPU. Inference on exported models runs comfortably on Apple silicon.',
      },
      {
        q: 'When are Windows and Linux coming?',
        a: 'macOS is available now. Windows and Linux are on the roadmap — join the waitlist and we\'ll email you the moment a build is ready for your platform.',
      },
      {
        q: 'What can the agent actually do on its own?',
        a: 'In Execute mode it can search and pull datasets, launch and monitor training runs, evaluate results, export models, and stage deployments. In Plan mode it proposes the steps and waits; in Review mode it audits its own output and tells you what it could and couldn\'t verify.',
      },
    ],
  },

  // Waitlist
  waitlist: {
    eyebrow: 'Waitlist',
    title: 'Join the waitlist',
    subtitle: 'Get early access when we launch. We will keep you updated on progress and notify you the moment VisionCraft is ready for you.',
    consent: 'No spam. Unsubscribe any time. We only email about VisionCraft.',
  },

  // Form
  form: {
    email: 'Email',
    emailPlaceholder: 'you@company.com',
    name: 'Name',
    namePlaceholder: 'Alex Chen',
    company: 'Company',
    companyPlaceholder: 'Acme Inc',
    useCase: 'Primary use case',
    useCasePlaceholder: 'Select one...',
    useCases: {
      'object-detection': 'Object Detection',
      'image-classification': 'Image Classification',
      'semantic-segmentation': 'Semantic Segmentation',
      'instance-segmentation': 'Instance Segmentation',
      'pose-estimation': 'Pose Estimation',
      'face-recognition': 'Face Recognition',
      'ocr': 'OCR / Text Recognition',
      'anomaly-detection': 'Anomaly Detection',
      'video-analytics': 'Video Analytics',
      'autonomous-vehicles': 'Autonomous Vehicles',
      'medical-imaging': 'Medical Imaging',
      'robotics': 'Robotics',
      'other': 'Other',
    },
    companyType: 'Company',
    individualType: 'Individual',
    submit: 'Join the waitlist',
    submitting: 'Submitting...',
    back: 'Back',
    completeSignup: 'Complete signup',
    progressText: 'Great! Just a few more details to personalize your experience.',
    successTitle: 'You are on the list',
    successBody: 'We will email you the moment there is something to try.',
    successBodyDemo: 'Demo mode - no data was stored. Connect a form endpoint to start collecting sign-ups.',
    addAnother: 'Add another',
    errorEmail: 'Please enter your email',
    errorEmailInvalid: 'Please enter a valid email address',
    errorName: 'Please enter your name',
    errorGeneric: 'Something went wrong. Please try again.',
  },

  // Showcase
  showcase: {
    items: [
      {
        title: 'Talk to the agent',
        subtitle: 'Watch it work',
        description: 'Three modes—Plan, Execute, Review—let you control how autonomous it is. The agent explains what it is doing at every step.',
      },
      {
        title: 'Live training metrics',
        subtitle: 'Not exit codes',
        description: 'Loss and mAP stream in real time. See the curve move epoch by epoch. Never waste a GPU-hour guessing if it worked.',
      },
      {
        title: 'Source datasets',
        subtitle: 'Inside the app',
        description: 'Search Roboflow, Kaggle, Hugging Face without leaving VisionCraft. The agent inspects class balance before you commit.',
      },
      {
        title: 'Start from pretrained',
        subtitle: 'Fine-tune on your data',
        description: 'Detection, classification, segmentation. Browse models, pick one, and train. Or publish your own to a versioned catalog.',
      },
      {
        title: 'Monitor in production',
        subtitle: 'Your entire fleet',
        description: 'Push models to edge devices. Track throughput, latency, drift. When performance slips, the agent proposes the fix.',
      },
    ],
  },

  // Chatbot
  chatbot: {
    trigger: 'Chat with us',
    title: 'VisionCraft Assistant',
    subtitle: 'Ask me anything about the platform',
    inputPlaceholder: 'Ask about features, pricing, how it works...',
    thinking: 'Thinking...',
    greeting: 'Hi! I can answer any questions about VisionCraft. What would you like to know?',
    error: 'Sorry, I encountered an error. Please try again or join our waitlist for direct support!',
  },

  // Footer
  footer: {
    tagline: 'The computer-vision pipeline, run by an agent.',
    product: 'Product',
    resources: 'Resources',
    company: 'Company',
    features: 'Features',
    workflow: 'Workflow',
    pricing: 'Pricing',
    download: 'Download',
    faq: 'FAQ',
    documentation: 'Documentation',
    requirements: 'System requirements',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
  },

  // Pages
  pages: {
    backToHome: 'Back to home',
    copyright: 'VisionCraft. All rights reserved.',
  },

  // Documentation Page
  docs: {
    title: 'Documentation',
    intro: 'Everything you need to get started with VisionCraft and master the agent-driven computer vision workflow.',
    gettingStarted: 'Getting Started',
    installation: 'Installation',
    quickStart: 'Quick Start',
    apiKeys: 'API Keys Setup',
    coreFeatures: 'Core Features',
    agentModes: 'Agent Modes',
    datasets: 'Dataset Sourcing',
    training: 'Model Training',
    deployment: 'Deployment',
    advanced: 'Advanced',
    monitoring: 'Production Monitoring',
    marketplace: 'Model Marketplace',
  },

  // Requirements Page
  requirements: {
    title: 'System Requirements',
    intro: 'VisionCraft is designed to run efficiently on modern hardware. Here\'s what you need to get started.',
    operatingSystem: 'Operating System',
    osMinimum: 'macOS 12 (Monterey) or later',
    osRecommended: 'macOS 13 (Ventura) or later for best performance',
    processor: 'Processor',
    cpuMinimum: 'Intel Core i5 (8th gen) or Apple M1',
    cpuRecommended: 'Apple M1 Pro/Max/Ultra or Intel Core i7/i9 (10th gen+)',
    memory: 'Memory',
    ramMinimum: '8 GB RAM',
    ramRecommended: '16 GB RAM or more for training large models',
    storage: 'Storage',
    storageMinimum: '10 GB available space',
    storageRecommended: 'SSD with 50 GB+ for datasets and model storage',
    gpu: 'GPU (Optional)',
    gpuNote: 'Not required but significantly speeds up training',
    gpuOptions: 'Apple Silicon (M1/M2/M3) or NVIDIA GPU with CUDA support',
    network: 'Network',
    networkNote: 'Internet connection required for dataset sourcing and API calls to AI providers',
    additional: 'Additional Requirements',
    apiKeysNote: 'API keys for your choice of providers (OpenAI, Groq, Gemini, etc.)',
    questionsNote: 'Still Have Questions?',
    questionsText: 'Check our',
    documentation: 'documentation',
    or: 'or reach out via the',
    contactPage: 'contact page',
  },

  // Contact Page
  contact: {
    title: 'Contact Us',
    intro: 'Have questions about VisionCraft? Want to discuss partnerships or enterprise solutions? We\'d love to hear from you.',
    email: 'Email',
    emailDesc: 'For general inquiries, support, or feedback',
    linkedin: 'LinkedIn',
    linkedinDesc: 'Connect with the founder',
    liveChat: 'Live Chat',
    liveChatDesc: 'Use the chatbot on our homepage for quick questions',
    chatNow: 'Chat Now',
    whatToExpect: 'What to Expect',
    responseTime: 'Response Time',
    responseTimeText: 'We typically respond within 24-48 hours',
    supportHours: 'Support Hours',
    supportHoursText: 'Monday - Friday, 9 AM - 6 PM CET',
    bugReports: 'Bug Reports',
    bugReportsText: 'Please include your OS version, VisionCraft version, and steps to reproduce',
    beforeReachOut: 'Before You Reach Out',
    beforeReachOutText: 'Check if your question is answered in our resources:',
    documentationLink: 'Documentation - Installation, setup, and usage guides',
    requirementsLink: 'System Requirements - Hardware and software needs',
    faqLink: 'FAQ - Common questions and answers',
    enterprise: 'Enterprise & Partnerships',
    enterpriseText: 'Interested in VisionCraft for your team or organization? Contact us to discuss:',
    teamLicensing: 'Team licensing and deployment',
    customIntegrations: 'Custom integrations and features',
    trainingOnboarding: 'Training and onboarding',
    strategicPartnerships: 'Strategic partnerships',
    getInTouch: 'Get in Touch',
  },

  // Privacy Page
  privacy: {
    title: 'Privacy Policy',
    intro: 'Your privacy is important to us. This policy explains how VisionCraft collects, uses, and protects your information.',
    lastUpdated: 'Last updated',
    dataCollection: 'Information We Collect',
    dataYouProvide: 'Data You Provide',
    dataYouProvideText: 'Email, name, and use case when you join the waitlist or contact us.',
    automaticData: 'Automatic Data',
    automaticDataText: 'Usage analytics and error reports (only if you opt in).',
    localData: 'Local Data',
    localDataText: 'Datasets, models, and training runs never leave your machine.',
    howWeUse: 'How We Use Your Data',
    sendUpdates: 'Send product updates and feature announcements',
    respondInquiries: 'Respond to support inquiries',
    improveProduct: 'Improve the product based on usage patterns (anonymized)',
    dataSharing: 'Data Sharing',
    dataSharingText: 'We do not sell your data. We only share information with:',
    serviceProviders: 'Service providers who help us operate (email, analytics)',
    legalRequirements: 'Legal requirements (court orders, compliance)',
    security: 'Security',
    securityText: 'We use industry-standard encryption and security practices. Your training data and models remain on your device.',
    yourRights: 'Your Rights',
    accessData: 'Access your data',
    deleteData: 'Request deletion',
    optOut: 'Opt out of emails',
    contactUs: 'Contact Us',
    contactUsText: 'Questions about this policy? Reach out:',
  },

  // Terms Page
  terms: {
    title: 'Terms of Service',
    intro: 'By using VisionCraft, you agree to these terms. Please read them carefully.',
    lastUpdated: 'Last updated',
    acceptance: 'Acceptance of Terms',
    acceptanceText: 'By downloading, installing, or using VisionCraft, you agree to be bound by these Terms of Service.',
    licenseGrant: 'License Grant',
    licenseGrantText: 'We grant you a limited, non-exclusive, non-transferable license to use VisionCraft for your personal or commercial projects.',
    userObligations: 'Your Obligations',
    validApiKeys: 'Provide valid API keys for third-party services',
    respectIpLaws: 'Respect intellectual property and data privacy laws',
    noMisuse: 'Do not misuse the service or attempt to reverse engineer it',
    dataOwnership: 'Data Ownership',
    dataOwnershipText: 'You own all datasets, models, and outputs created with VisionCraft. We claim no rights to your work.',
    thirdPartyServices: 'Third-Party Services',
    thirdPartyText: 'VisionCraft integrates with OpenAI, Groq, Gemini, Roboflow, and others. You are responsible for compliance with their terms.',
    disclaimers: 'Disclaimers',
    providedAsIs: 'VisionCraft is provided "as is" without warranties',
    noLiabilityForDataLoss: 'We are not liable for data loss, model failures, or financial losses',
    useAtOwnRisk: 'Use the agent\'s outputs at your own risk',
    liabilityLimitations: 'Limitation of Liability',
    liabilityText: 'Our liability is limited to the amount you paid for VisionCraft in the past 12 months (currently free during preview).',
    termination: 'Termination',
    terminationText: 'We may terminate or suspend access if you violate these terms. You may stop using VisionCraft at any time.',
    changes: 'Changes to Terms',
    changesText: 'We may update these terms. Continued use after changes constitutes acceptance.',
    governingLaw: 'Governing Law',
    governingLawText: 'These terms are governed by the laws of France.',
    contactUs: 'Contact Us',
    contactUsText: 'Questions about these terms? Reach out:',
  },
}

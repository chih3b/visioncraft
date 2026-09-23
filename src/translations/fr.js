export const fr = {
  // Navigation
  nav: {
    features: 'Fonctionnalités',
    workflow: 'Flux de travail',
    pricing: 'Tarifs',
    faq: 'FAQ',
    joinWaitlist: 'Rejoindre la liste',
  },

  // Hero
  hero: {
    titleLead: 'Pipeline de vision par ordinateur',
    titleAccent: 'piloté par un agent',
    subhead: 'Sourcez des ensembles de données, entraînez des modèles, évaluez les résultats et déployez sur des appareils edge—guidé par un agent IA qui explique chaque étape. Fonctionne en local. Vos clés. Vos données.',
    primaryCta: 'Accès anticipé',
    secondaryCta: 'Voir comment ça marche',
    status: 'Accès anticipé ouvert · macOS en premier',
  },

  // Features
  features: {
    title: 'Tout ce dont vous avez besoin pour déployer la vision par ordinateur',
    items: [
      {
        title: 'Flux piloté par agent',
        body: "Décrivez ce que vous voulez en langage naturel. L'agent planifie les étapes, choisit les bons outils et explique ce qu'il fait à chaque étape.",
      },
      {
        title: 'Fonctionne sur votre machine',
        body: "L'entraînement, l'inférence et vos données ne quittent jamais votre ordinateur. Le backend, la file d'attente et le stockage de modèles fonctionnent dans l'application desktop.",
      },
      {
        title: 'Apportez vos propres clés',
        body: "Connectez OpenAI, Groq, Gemini, Roboflow, Kaggle, Hugging Face. Vous payez les fournisseurs directement. L'agent choisit le bon pour chaque tâche.",
      },
      {
        title: 'Marketplace de modèles',
        body: 'Commencez avec des modèles pré-entraînés de détection, classification et segmentation. Publiez les vôtres dans un catalogue versionné.',
      },
      {
        title: 'Métriques en temps réel',
        body: "Mettez les exécutions en file d'attente, regardez la loss et le mAP en temps réel, et comparez les expériences. Basculez vers des GPU cloud quand le matériel local est limité.",
      },
      {
        title: 'Déploiement edge',
        body: "Poussez les modèles vers des appareils enregistrés, puis surveillez le débit, la latence et la dérive depuis un tableau de bord de production unique.",
      },
    ],
  },

  // Workflow
  workflow: {
    title: 'Du dataset au déploiement',
    subtitle: 'Cinq étapes. Un agent. Zéro changement de contexte.',
    steps: [
      {
        step: 'Source',
        title: 'Trouvez et préparez un dataset',
        body: "Recherchez Roboflow, Kaggle et Hugging Face depuis l'application. L'agent récupère un ensemble étiqueté, inspecte l'équilibre des classes et signale les lacunes avant que vous ne dépensiez une heure de GPU.",
      },
      {
        step: 'Entraîner',
        title: 'Affinez avec des métriques en direct',
        body: "Lancez une exécution et regardez box loss, class loss et mAP en temps réel. Les checkpoints sont versionnés pour toujours revenir à la meilleure époque.",
      },
      {
        step: 'Évaluer',
        title: 'Examinez les résultats par classe',
        body: "L'agent lit les prédictions réelles — pas seulement le code de sortie — rapporte le mAP par classe et met en évidence les exemples les plus faibles pour que vous sachiez quoi corriger.",
      },
      {
        step: 'Déployer',
        title: 'Exportez et poussez vers un appareil',
        body: "Exportez vers Core ML, ONNX ou TensorRT et préparez un déploiement vers un appareil edge enregistré. Le transfert est vérifié de bout en bout, pas supposé.",
      },
      {
        step: 'Surveiller',
        title: 'Observez-le en production',
        body: "Suivez la latence, le débit et la dérive de confiance par appareil. Quand une métrique glisse, l'agent propose le réentraînement qui la corrigerait.",
      },
    ],
  },

  // Pricing
  pricing: {
    title: 'Tarification simple et transparente',
    subtitle: 'Commencez gratuitement. Évoluez quand vous êtes prêt.',
    preview: {
      name: 'Aperçu',
      price: 'Gratuit',
      cadence: 'pendant la prévisualisation',
      tagline: "L'application complète pendant notre prévisualisation publique.",
      cta: 'Télécharger pour macOS',
    },
    pro: {
      name: 'Pro',
      price: 'Bientôt disponible',
      tagline: 'Pour les praticiens qui déploient des modèles régulièrement.',
      cta: 'Rejoindre la liste',
    },
    team: {
      name: 'Équipe',
      price: 'Personnalisé',
      cadence: 'facturé annuellement',
      tagline: 'Catalogue partagé et flotte pour une équipe.',
      cta: 'Contacter les ventes',
    },
  },

  // FAQ
  faq: {
    title: 'Questions fréquemment posées',
    items: [
      {
        q: 'Mes données ou mes images quittent-elles ma machine?',
        a: "Non. L'entraînement, l'inférence, la file d'attente de travaux et le stockage de modèles fonctionnent tous dans l'application sur votre ordinateur. Les seuls appels sortants sont ceux que vous configurez — vers les fournisseurs d'IA dont vous fournissez les clés.",
      },
      {
        q: 'Que signifie "apportez vos propres clés" en pratique?',
        a: "Vous collez les clés API pour les fournisseurs que vous souhaitez utiliser (OpenAI, Groq, Gemini, Hugging Face, Roboflow, et autres). VisionCraft les utilise en votre nom et vous êtes facturé directement par chaque fournisseur. Groq a un niveau gratuit qui couvre la plupart du travail de l'agent.",
      },
      {
        q: "Ai-je besoin d'un GPU?",
        a: "Cela aide pour l'entraînement, mais ce n'est pas obligatoire. Vous pouvez basculer vers des GPU cloud via votre propre fournisseur ou exécuter des tâches plus petites sur CPU local. L'inférence sur les modèles exportés fonctionne confortablement sur Apple silicon.",
      },
      {
        q: 'Quand Windows et Linux arrivent-ils?',
        a: "macOS est disponible maintenant. Windows et Linux sont sur la feuille de route — rejoignez la liste d'attente et nous vous enverrons un email dès qu'une version sera prête pour votre plateforme.",
      },
      {
        q: "Que peut réellement faire l'agent par lui-même?",
        a: "En mode Execute, il peut rechercher et récupérer des datasets, lancer et surveiller des exécutions d'entraînement, évaluer les résultats, exporter des modèles et préparer des déploiements. En mode Plan, il propose les étapes et attend; en mode Review, il audite sa propre sortie et vous dit ce qu'il a pu et n'a pas pu vérifier.",
      },
    ],
  },

  // Waitlist
  waitlist: {
    eyebrow: "Liste d'attente",
    title: "Rejoignez la liste d'attente",
    subtitle: "Obtenez un accès anticipé lors de notre lancement. Nous vous tiendrons informé de la progression et vous avertirons dès que VisionCraft sera prêt pour vous.",
    consent: 'Pas de spam. Désabonnement à tout moment. Nous envoyons uniquement des emails sur VisionCraft.',
  },

  // Form
  form: {
    email: 'Email',
    emailPlaceholder: 'vous@entreprise.com',
    name: 'Nom',
    namePlaceholder: 'Alex Chen',
    company: 'Entreprise',
    companyPlaceholder: 'Acme Inc',
    useCase: "Cas d'usage principal",
    useCasePlaceholder: 'Sélectionnez un...',
    useCases: {
      'object-detection': "Détection d'objets",
      'image-classification': "Classification d'images",
      'semantic-segmentation': 'Segmentation sémantique',
      'instance-segmentation': "Segmentation d'instances",
      'pose-estimation': 'Estimation de pose',
      'face-recognition': 'Reconnaissance faciale',
      'ocr': 'OCR / Reconnaissance de texte',
      'anomaly-detection': "Détection d'anomalies",
      'video-analytics': 'Analyse vidéo',
      'autonomous-vehicles': 'Véhicules autonomes',
      'medical-imaging': 'Imagerie médicale',
      'robotics': 'Robotique',
      'other': 'Autre',
    },
    companyType: 'Entreprise',
    individualType: 'Individuel',
    submit: "Rejoindre la liste d'attente",
    submitting: 'Envoi en cours...',
    back: 'Retour',
    completeSignup: "Terminer l'inscription",
    progressText: 'Super! Juste quelques détails de plus pour personnaliser votre expérience.',
    successTitle: 'Vous êtes sur la liste',
    successBody: 'Nous vous enverrons un email dès qu\'il y aura quelque chose à essayer.',
    successBodyDemo: 'Mode démo - aucune donnée n\'a été stockée. Connectez un endpoint de formulaire pour commencer à collecter des inscriptions.',
    addAnother: 'En ajouter un autre',
    errorEmail: 'Veuillez entrer votre email',
    errorEmailInvalid: 'Veuillez entrer une adresse email valide',
    errorName: 'Veuillez entrer votre nom',
    errorGeneric: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
  },

  // Showcase
  showcase: {
    items: [
      {
        title: 'Parlez à l\'agent',
        subtitle: 'Regardez-le travailler',
        description: 'Trois modes—Plan, Execute, Review—vous permettent de contrôler son autonomie. L\'agent explique ce qu\'il fait à chaque étape.',
      },
      {
        title: 'Métriques d\'entraînement en direct',
        subtitle: 'Pas de codes de sortie',
        description: 'La loss et le mAP s\'affichent en temps réel. Voyez la courbe évoluer époque par époque. Ne gaspillez jamais une heure de GPU en devinant si cela a fonctionné.',
      },
      {
        title: 'Sourcez des datasets',
        subtitle: 'Dans l\'application',
        description: 'Recherchez Roboflow, Kaggle, Hugging Face sans quitter VisionCraft. L\'agent inspecte l\'équilibre des classes avant que vous ne vous engagiez.',
      },
      {
        title: 'Commencez avec du pré-entraîné',
        subtitle: 'Affinez sur vos données',
        description: 'Détection, classification, segmentation. Parcourez les modèles, choisissez-en un et entraînez. Ou publiez le vôtre dans un catalogue versionné.',
      },
      {
        title: 'Surveillez en production',
        subtitle: 'Toute votre flotte',
        description: 'Poussez les modèles vers des appareils edge. Suivez le débit, la latence, la dérive. Quand la performance baisse, l\'agent propose la correction.',
      },
    ],
  },

  // Chatbot
  chatbot: {
    trigger: 'Discutez avec nous',
    title: 'Assistant VisionCraft',
    subtitle: 'Posez-moi des questions sur la plateforme',
    inputPlaceholder: 'Demandez des informations sur les fonctionnalités, les tarifs, le fonctionnement...',
    thinking: 'Réflexion...',
    greeting: 'Bonjour! Je peux répondre à toutes vos questions sur VisionCraft. Que souhaitez-vous savoir?',
    error: 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer ou rejoignez notre liste d\'attente pour un support direct!',
  },

  // Footer
  footer: {
    tagline: 'Le pipeline de vision par ordinateur, piloté par un agent.',
    product: 'Produit',
    resources: 'Ressources',
    company: 'Entreprise',
    features: 'Fonctionnalités',
    workflow: 'Flux de travail',
    pricing: 'Tarifs',
    download: 'Télécharger',
    faq: 'FAQ',
    documentation: 'Documentation',
    requirements: 'Configuration requise',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    contact: 'Contact',
  },

  // Pages
  pages: {
    backToHome: 'Retour à l\'accueil',
    copyright: 'VisionCraft. Tous droits réservés.',
  },

  // Documentation Page
  docs: {
    title: 'Documentation',
    intro: 'Tout ce dont vous avez besoin pour commencer avec VisionCraft et maîtriser le flux de travail piloté par agent.',
  },

  // Requirements Page
  requirements: {
    title: 'Configuration Requise',
    intro: 'VisionCraft est conçu pour fonctionner efficacement sur du matériel moderne. Voici ce dont vous avez besoin pour commencer.',
    operatingSystem: 'Système d\'exploitation',
    osMinimum: 'macOS 12 (Monterey) ou ultérieur',
    osRecommended: 'macOS 13 (Ventura) ou ultérieur pour de meilleures performances',
    processor: 'Processeur',
    cpuMinimum: 'Intel Core i5 (8e gén) ou Apple M1',
    cpuRecommended: 'Apple M1 Pro/Max/Ultra ou Intel Core i7/i9 (10e gén+)',
    memory: 'Mémoire',
    ramMinimum: '8 Go de RAM',
    ramRecommended: '16 Go de RAM ou plus pour entraîner de grands modèles',
    storage: 'Stockage',
    storageMinimum: '10 Go d\'espace disponible',
    storageRecommended: 'SSD avec 50 Go+ pour les ensembles de données et le stockage des modèles',
    gpu: 'GPU (Optionnel)',
    gpuNote: 'Non requis mais accélère considérablement l\'entraînement',
    gpuOptions: 'Apple Silicon (M1/M2/M3) ou GPU NVIDIA avec support CUDA',
    network: 'Réseau',
    networkNote: 'Connexion Internet requise pour le sourcing de données et les appels API aux fournisseurs IA',
    additional: 'Exigences Supplémentaires',
    apiKeysNote: 'Clés API pour vos fournisseurs de choix (OpenAI, Groq, Gemini, etc.)',
    questionsNote: 'Encore des Questions?',
    questionsText: 'Consultez notre',
    documentation: 'documentation',
    or: 'ou contactez-nous via la',
    contactPage: 'page de contact',
  },

  // Contact Page
  contact: {
    title: 'Nous Contacter',
    intro: 'Vous avez des questions sur VisionCraft? Vous souhaitez discuter de partenariats ou de solutions d\'entreprise? Nous serions ravis de vous entendre.',
    email: 'E-mail',
    emailDesc: 'Pour les demandes générales, le support ou les commentaires',
    linkedin: 'LinkedIn',
    linkedinDesc: 'Connectez-vous avec le fondateur',
    liveChat: 'Chat en Direct',
    liveChatDesc: 'Utilisez le chatbot sur notre page d\'accueil pour des questions rapides',
    chatNow: 'Discuter Maintenant',
    whatToExpect: 'À Quoi S\'attendre',
    responseTime: 'Temps de Réponse',
    responseTimeText: 'Nous répondons généralement dans les 24-48 heures',
    supportHours: 'Heures de Support',
    supportHoursText: 'Lundi - Vendredi, 9h - 18h CET',
    bugReports: 'Rapports de Bugs',
    bugReportsText: 'Veuillez inclure votre version d\'OS, version de VisionCraft et étapes pour reproduire',
    beforeReachOut: 'Avant de Nous Contacter',
    beforeReachOutText: 'Vérifiez si votre question trouve réponse dans nos ressources:',
    documentationLink: 'Documentation - Guides d\'installation, configuration et utilisation',
    requirementsLink: 'Configuration Requise - Besoins matériels et logiciels',
    faqLink: 'FAQ - Questions et réponses courantes',
    enterprise: 'Entreprise & Partenariats',
    enterpriseText: 'Intéressé par VisionCraft pour votre équipe ou organisation? Contactez-nous pour discuter:',
    teamLicensing: 'Licence et déploiement d\'équipe',
    customIntegrations: 'Intégrations et fonctionnalités personnalisées',
    trainingOnboarding: 'Formation et intégration',
    strategicPartnerships: 'Partenariats stratégiques',
    getInTouch: 'Nous Contacter',
  },

  // Privacy Page
  privacy: {
    title: 'Politique de Confidentialité',
    intro: 'Votre confidentialité est importante pour nous. Cette politique explique comment VisionCraft collecte, utilise et protège vos informations.',
    lastUpdated: 'Dernière mise à jour',
  },

  // Terms Page
  terms: {
    title: 'Conditions d\'Utilisation',
    intro: 'En utilisant VisionCraft, vous acceptez ces conditions. Veuillez les lire attentivement.',
    lastUpdated: 'Dernière mise à jour',
  },
}

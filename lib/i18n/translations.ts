export type Locale = "en" | "de" | "fr";

export const defaultLocale: Locale = "en";

const translations = {
  en: {
    onboarding: {
      brandName: "matura",
      steps: {
        start: "Start",
        projectMode: "Project Type",
        toolIdea: "Idea",
        usersRoles: "Users & Roles",
        workflows: "Workflows",
        files: "Files",
        review: "Review",
      },
      welcome: {
        greeting: "Hello, {{name}}",
        description:
          "We'll guide you through a few simple questions to understand what software you need. Just describe your idea in plain language — our AI will handle the rest and create a complete plan for you: vision, requirements, cost estimate, and more.",
        saveNote:
          "Your progress is saved automatically as you move through each step.",
        cta: "Let's get started!",
      },
      projectMode: {
        title: "What type of project is this?",
        description:
          "This determines how our AI agents operate — internal projects connect to your organization's tools and data, while external projects also run competitive analysis and pull public information.",
        internal: "Internal (On-Premise)",
        internalDesc:
          "Connects to internal tools and databases. For proprietary projects within your organization. No external data sources.",
        external: "External (Cloud)",
        externalDesc:
          "Runs competitive analysis against external sources. Can pull in public information to enrich your plan.",
      },
      toolIdea: {
        title: "Describe your idea",
        question:
          "What do you need to build? Describe the problem it solves and what it should do. The more detail you provide, the better the result.",
        placeholder:
          "e.g. We need an internal portal where employees can report IT incidents, support teams can triage and resolve them, and important fixes can become tracked change requests with approvals...",
      },
      usersRoles: {
        title: "Who will use this software?",
        description:
          "Tell us about the people who will use this software and what they should be able to do. This helps us design the right experience for each type of user.",
        rolesLabel: "What types of users will this software have?",
        rolesPlaceholder:
          "e.g. Admin, Team Lead, Regular Employee, Support Agent, Approver...",
        accessLabel:
          "Who should be able to do what?",
        accessPlaceholder:
          "e.g. Only admins can delete records, team leads can approve requests, employees can only see their own data...",
      },
      workflows: {
        title: "How should the software work?",
        description:
          "Walk us through the main processes. Think of it as explaining how work flows from start to finish.",
        keyWorkflowsLabel:
          "What are the main steps or processes?",
        keyWorkflowsPlaceholder:
          "e.g. Employee reports incident → Support triages → Assigns responder → Investigation → Resolution → Optional change request...",
        approvalsLabel:
          "Are there any approval or sign-off steps?",
        approvalsPlaceholder:
          "e.g. High-risk changes need two approvals, budget requests over $5k need manager sign-off...",
        notificationsLabel:
          "What notifications or reminders are needed?",
        notificationsPlaceholder:
          "e.g. Email reminders for overdue tasks, alerts when something is urgent, daily summary for managers...",
      },
      files: {
        title: "Any supporting documents?",
        description:
          "Upload any relevant files — briefs, process diagrams, existing spreadsheets, or notes. These help our AI understand your needs better. This step is optional.",
        dropzone: "Drag & drop files here, or click to browse",
        maxSize: "Max 10MB per file",
        noFiles: "No files uploaded yet",
        remove: "Remove",
      },
      review: {
        title: "Review your submission",
        toolIdeaLabel: "Software idea",
        projectModeLabel: "Project type",
        userRolesLabel: "User types",
        accessControlLabel: "Permissions",
        keyWorkflowsLabel: "Key processes",
        approvalsLabel: "Approvals",
        notificationsLabel: "Notifications",
        filesLabel: "Uploaded files",
        noFiles: "None",
        notProvided: "Not provided",
        submit: "Generate My Plan",
        submitting: "Generating...",
      },
      questions: {
        placeholder: "Type your answer here",
        continue: "Continue",
      },
      nav: {
        back: "Back",
        next: "Next",
        saveProgress: "Save Progress",
      },
    },
    dashboard: {
      title: "Business Dashboard",
      generating: "Our AI agents are analyzing your input and generating your plan...",
      vision: {
        title: "Vision",
        content:
          "A centralized internal portal that empowers employees to report IT incidents seamlessly, enables support teams to efficiently triage and resolve issues, and provides a structured change management process with approval workflows — improving response times, accountability, and operational transparency across the organization.",
      },
      requirements: {
        title: "Requirements",
        functional: "Functional Requirements",
        nonFunctional: "Non-Functional Requirements",
        items: [
          "Employees can submit incident reports with severity classification",
          "Support teams can triage, assign, and track incident resolution",
          "Resolved incidents can be escalated to tracked change requests",
          "Multi-level approval workflow for change requests based on risk",
          "Role-based access control (Employee, Support, Approver, Admin)",
          "Email and in-app notifications for status changes and assignments",
          "Full audit trail for all incidents and change requests",
          "Dashboard views with filtering by status, severity, and assignee",
        ],
        nfItems: [
          "Response time under 200ms for all UI interactions",
          "Support 500+ concurrent users",
          "99.9% uptime SLA",
          "GDPR compliant data handling",
          "SSO integration support",
        ],
      },
      cost: {
        title: "Cost Estimate",
        effort: "Estimated Effort",
        effortValue: "12-16 weeks",
        complexity: "Complexity",
        complexityValue: "Medium",
        team: "Suggested Team",
        teamValue: "2 Frontend, 2 Backend, 1 Designer, 1 PM",
        breakdown: "Effort Breakdown",
        phases: [
          { name: "Discovery & Design", weeks: "2-3 weeks", percent: 18 },
          { name: "Core Development", weeks: "5-7 weeks", percent: 42 },
          { name: "Integrations & Auth", weeks: "2-3 weeks", percent: 18 },
          { name: "Testing & QA", weeks: "2-3 weeks", percent: 15 },
          { name: "Deployment & Launch", weeks: "1 week", percent: 7 },
        ],
      },
      competitive: {
        title: "Competitive Analysis",
        description: "Similar tools and how your solution compares.",
        competitors: [
          {
            name: "ServiceNow",
            strength: "Enterprise-grade ITSM with deep integrations",
            gap: "Expensive, complex setup, overkill for smaller teams",
          },
          {
            name: "Jira Service Management",
            strength: "Strong ticketing and workflow engine",
            gap: "Limited change management, requires additional plugins",
          },
          {
            name: "Freshservice",
            strength: "User-friendly, good incident management",
            gap: "Weaker approval workflows, limited customization",
          },
        ],
        advantage:
          "Your software is purpose-built for your organization's specific workflows, combining incident management with change tracking in a single, simple interface — without the overhead of enterprise platforms.",
      },
    },
    landing: {
      headline: "From rough idea to\nimplementation-ready plan",
      subtitle: "matura is an agentic AI system that transforms a software concept into a complete SDLC specification — vision, requirements, architecture, backlog, tests, and more — in minutes, not weeks.",
      featureIdeaTitle: "Idea to Plan in Minutes",
      featureIdeaDesc: "Describe your software idea in plain language and get a complete, implementation-ready plan generated by AI agents.",
      featureLoopTitle: "Retro-Feedback Loop",
      featureLoopDesc: "Refine any artifact and watch changes propagate automatically across vision, requirements, architecture, and backlog.",
      featureViewsTitle: "Business & Technical Views",
      featureViewsDesc: "One pipeline, two dashboards. Business stakeholders see cost and competitive analysis. Engineers see architecture and tests.",
      featureSdlcTitle: "Full SDLC Coverage",
      featureSdlcDesc: "Vision, requirements, architecture, frameworks, backlog, test definitions, cost estimates, and competitive analysis.",
      footer: "Built for the Swiss Life Claude Builders Hackathon. Powered by Claude.",
    },
    home: {
      welcome: "Welcome to matura",
      subtitle: "Transform any software idea into a complete, implementation-ready plan.",
      totalProjects: "Total Projects",
      newFlow: "New Flow",
      tipGenerate: "Each flow generates vision, requirements, architecture, backlog, tests, cost estimates, and competitive analysis.",
      tipRefine: "Refine any artifact in the workspace and all related specs update automatically via the retro-feedback loop.",
      yourFlows: "Your Flows",
      createNewFlow: "Create New Flow",
      loading: "Loading projects...",
      noFlows: "No flows yet. Start your first one to see it here.",
      createFirstFlow: "Create Your First Flow",
      project: "Project",
      mode: "Mode",
      created: "Created",
      actions: "Actions",
      workspace: "Workspace",
      internal: "Internal",
      external: "External",
    },
    workspace: {
      home: "Home",
      business: "Business",
      technical: "Technical",
      architecture: "Architecture",
      generating: "Generating",
      externalMode: "External mode",
      internalMode: "Internal mode",
      generationFailed: "Generation failed",
      rateLimitError: "API rate limit reached — please wait a moment and try again.",
      authError: "Invalid API key. Check ANTHROPIC_API_KEY in .env.local.",
      genericError: "Something went wrong. Please try again.",
      backToHome: "Back to home",
      refinementsApplied: "refinement(s) applied — artifacts kept in sync",
      projectWorkspace: "Project Workspace",
    },
  },
  de: {
    onboarding: {
      brandName: "matura",
      steps: {
        start: "Start",
        projectMode: "Projekttyp",
        toolIdea: "Idee",
        usersRoles: "Benutzer & Rollen",
        workflows: "Workflows",
        files: "Dateien",
        review: "Uebersicht",
      },
      welcome: {
        greeting: "Hallo, {{name}}",
        description:
          "Wir fuehren Sie durch einige einfache Fragen, um zu verstehen, welche Software Sie benoetigen. Beschreiben Sie Ihre Idee einfach in Ihren eigenen Worten — unsere KI erledigt den Rest.",
        saveNote:
          "Ihr Fortschritt wird automatisch gespeichert, waehrend Sie die Schritte durchlaufen.",
        cta: "Los geht's!",
      },
      projectMode: {
        title: "Was fuer ein Projekttyp ist das?",
        description:
          "Dies bestimmt, wie unsere KI-Agenten arbeiten — interne Projekte verbinden sich mit den Tools Ihrer Organisation, externe Projekte fuehren zusaetzlich Wettbewerbsanalysen durch.",
        internal: "Intern (On-Premise)",
        internalDesc:
          "Verbindet sich mit internen Tools und Datenbanken. Fuer proprietaere Projekte innerhalb Ihrer Organisation.",
        external: "Extern (Cloud)",
        externalDesc:
          "Fuehrt Wettbewerbsanalysen durch. Kann oeffentliche Informationen einbeziehen.",
      },
      toolIdea: {
        title: "Beschreiben Sie Ihre Software-Idee",
        question:
          "Welche Software brauchen Sie? Beschreiben Sie das Problem und was es loesen soll. Je mehr Details, desto besser.",
        placeholder:
          "z.B. Wir brauchen ein internes Portal, in dem Mitarbeiter IT-Vorfaelle melden koennen...",
      },
      usersRoles: {
        title: "Wer wird diese Software nutzen?",
        description:
          "Erzaehlen Sie uns von den Personen, die diese Software verwenden werden und was sie tun koennen sollen.",
        rolesLabel: "Welche Benutzertypen wird diese Software haben?",
        rolesPlaceholder:
          "z.B. Admin, Teamleiter, Mitarbeiter, Support-Agent, Genehmiger...",
        accessLabel: "Wer soll was tun koennen?",
        accessPlaceholder:
          "z.B. Nur Admins koennen loeschen, Teamleiter koennen genehmigen...",
      },
      workflows: {
        title: "Wie soll die Software funktionieren?",
        description:
          "Beschreiben Sie die Hauptprozesse. Erklaeren Sie, wie die Arbeit von Anfang bis Ende ablaeuft.",
        keyWorkflowsLabel: "Was sind die Hauptschritte oder Prozesse?",
        keyWorkflowsPlaceholder:
          "z.B. Mitarbeiter meldet Vorfall → Support sichtet → Bearbeiter zuweisen → Loesung...",
        approvalsLabel: "Gibt es Genehmigungsschritte?",
        approvalsPlaceholder:
          "z.B. Hochrisiko-Aenderungen brauchen zwei Genehmigungen...",
        notificationsLabel: "Welche Benachrichtigungen werden benoetigt?",
        notificationsPlaceholder:
          "z.B. E-Mail-Erinnerungen fuer ueberfaellige Aufgaben, Warnungen bei Dringlichkeit...",
      },
      files: {
        title: "Unterstuetzende Dokumente?",
        description:
          "Laden Sie relevante Dateien hoch — Briefings, Prozessdiagramme, Tabellen oder Notizen. Dieser Schritt ist optional.",
        dropzone: "Dateien hierher ziehen oder klicken zum Durchsuchen",
        maxSize: "Max. 10 MB pro Datei",
        noFiles: "Noch keine Dateien hochgeladen",
        remove: "Entfernen",
      },
      review: {
        title: "Ihre Eingaben ueberpruefen",
        toolIdeaLabel: "Software-Idee",
        projectModeLabel: "Projekttyp",
        userRolesLabel: "Benutzertypen",
        accessControlLabel: "Berechtigungen",
        keyWorkflowsLabel: "Hauptprozesse",
        approvalsLabel: "Genehmigungen",
        notificationsLabel: "Benachrichtigungen",
        filesLabel: "Hochgeladene Dateien",
        noFiles: "Keine",
        notProvided: "Nicht angegeben",
        submit: "Meinen Plan erstellen",
        submitting: "Wird generiert...",
      },
      questions: {
        placeholder: "Geben Sie hier Ihre Antwort ein",
        continue: "Weiter",
      },
      nav: {
        back: "Zurueck",
        next: "Weiter",
        saveProgress: "Fortschritt speichern",
      },
    },
    dashboard: {
      title: "Business Dashboard",
      generating: "Unsere KI-Agenten analysieren Ihre Eingaben und erstellen Ihren Plan...",
      vision: { title: "Vision", content: "" },
      requirements: {
        title: "Anforderungen",
        functional: "Funktionale Anforderungen",
        nonFunctional: "Nicht-funktionale Anforderungen",
        items: [],
        nfItems: [],
      },
      cost: {
        title: "Kostenschaetzung",
        effort: "Geschaetzter Aufwand",
        effortValue: "",
        complexity: "Komplexitaet",
        complexityValue: "",
        team: "Vorgeschlagenes Team",
        teamValue: "",
        breakdown: "Aufwandsverteilung",
        phases: [],
      },
      competitive: {
        title: "Wettbewerbsanalyse",
        description: "",
        competitors: [],
        advantage: "",
      },
    },
    landing: {
      headline: "Von der groben Idee zum\numsetzungsreifen Plan",
      subtitle: "matura ist ein agentisches KI-System, das ein Softwarekonzept in eine vollstaendige SDLC-Spezifikation verwandelt — Vision, Anforderungen, Architektur, Backlog, Tests und mehr — in Minuten statt Wochen.",
      featureIdeaTitle: "Von der Idee zum Plan in Minuten",
      featureIdeaDesc: "Beschreiben Sie Ihre Software-Idee in einfacher Sprache und erhalten Sie einen vollstaendigen, umsetzungsreifen Plan von KI-Agenten.",
      featureLoopTitle: "Retro-Feedback-Schleife",
      featureLoopDesc: "Verfeinern Sie jedes Artefakt und beobachten Sie, wie Aenderungen automatisch ueber Vision, Anforderungen, Architektur und Backlog propagiert werden.",
      featureViewsTitle: "Business- & Technische Ansichten",
      featureViewsDesc: "Eine Pipeline, zwei Dashboards. Business-Stakeholder sehen Kosten und Wettbewerbsanalyse. Ingenieure sehen Architektur und Tests.",
      featureSdlcTitle: "Vollstaendige SDLC-Abdeckung",
      featureSdlcDesc: "Vision, Anforderungen, Architektur, Frameworks, Backlog, Testdefinitionen, Kostenschaetzungen und Wettbewerbsanalyse.",
      footer: "Erstellt fuer den Swiss Life Claude Builders Hackathon. Powered by Claude.",
    },
    home: {
      welcome: "Willkommen bei matura",
      subtitle: "Verwandeln Sie jede Software-Idee in einen vollstaendigen, umsetzungsreifen Plan.",
      totalProjects: "Projekte gesamt",
      newFlow: "Neuer Flow",
      tipGenerate: "Jeder Flow generiert Vision, Anforderungen, Architektur, Backlog, Tests, Kostenschaetzungen und Wettbewerbsanalyse.",
      tipRefine: "Verfeinern Sie jedes Artefakt im Workspace und alle zugehoerigen Spezifikationen werden automatisch ueber die Retro-Feedback-Schleife aktualisiert.",
      yourFlows: "Ihre Flows",
      createNewFlow: "Neuen Flow erstellen",
      loading: "Projekte werden geladen...",
      noFlows: "Noch keine Flows. Starten Sie Ihren ersten, um ihn hier zu sehen.",
      createFirstFlow: "Ersten Flow erstellen",
      project: "Projekt",
      mode: "Modus",
      created: "Erstellt",
      actions: "Aktionen",
      workspace: "Workspace",
      internal: "Intern",
      external: "Extern",
    },
    workspace: {
      home: "Startseite",
      business: "Business",
      technical: "Technisch",
      architecture: "Architektur",
      generating: "Wird generiert",
      externalMode: "Externer Modus",
      internalMode: "Interner Modus",
      generationFailed: "Generierung fehlgeschlagen",
      rateLimitError: "API-Ratenlimit erreicht — bitte warten Sie einen Moment und versuchen Sie es erneut.",
      authError: "Ungueltiger API-Schluessel. Pruefen Sie ANTHROPIC_API_KEY in .env.local.",
      genericError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      backToHome: "Zurueck zur Startseite",
      refinementsApplied: "Verfeinerung(en) angewendet — Artefakte synchronisiert",
      projectWorkspace: "Projekt-Workspace",
    },
  },
  fr: {
    onboarding: {
      brandName: "matura",
      steps: {
        start: "Debut",
        projectMode: "Type de projet",
        toolIdea: "Idee",
        usersRoles: "Utilisateurs & Roles",
        workflows: "Workflows",
        files: "Fichiers",
        review: "Revue",
      },
      welcome: {
        greeting: "Bonjour, {{name}}",
        description:
          "Nous allons vous guider avec quelques questions simples pour comprendre quel logiciel vous avez besoin. Decrivez votre idee simplement — notre IA s'occupe du reste.",
        saveNote:
          "Votre progression est sauvegardee automatiquement a chaque etape.",
        cta: "C'est parti !",
      },
      projectMode: {
        title: "Quel type de projet est-ce ?",
        description:
          "Cela determine comment nos agents IA fonctionnent — les projets internes se connectent aux outils de votre organisation, les projets externes effectuent des analyses concurrentielles.",
        internal: "Interne (On-Premise)",
        internalDesc:
          "Se connecte aux outils et bases de donnees internes de votre organisation.",
        external: "Externe (Cloud)",
        externalDesc:
          "Execute des analyses concurrentielles. Peut integrer des informations publiques.",
      },
      toolIdea: {
        title: "Decrivez votre idee de logiciel",
        question:
          "De quel logiciel avez-vous besoin ? Decrivez le probleme et ce qu'il devrait faire.",
        placeholder:
          "ex. Nous avons besoin d'un portail interne ou les employes peuvent signaler des incidents...",
      },
      usersRoles: {
        title: "Qui utilisera ce logiciel ?",
        description:
          "Parlez-nous des personnes qui utiliseront ce logiciel et de ce qu'elles devraient pouvoir faire.",
        rolesLabel: "Quels types d'utilisateurs ce logiciel aura-t-il ?",
        rolesPlaceholder:
          "ex. Admin, Chef d'equipe, Employe, Agent de support, Approbateur...",
        accessLabel: "Qui devrait pouvoir faire quoi ?",
        accessPlaceholder:
          "ex. Seuls les admins peuvent supprimer, les chefs d'equipe peuvent approuver...",
      },
      workflows: {
        title: "Comment le logiciel devrait-il fonctionner ?",
        description:
          "Decrivez les processus principaux. Expliquez comment le travail se deroule du debut a la fin.",
        keyWorkflowsLabel: "Quelles sont les etapes principales ?",
        keyWorkflowsPlaceholder:
          "ex. Employe signale un incident → Support trie → Resolution...",
        approvalsLabel: "Y a-t-il des etapes d'approbation ?",
        approvalsPlaceholder:
          "ex. Les changements a haut risque necessitent deux approbations...",
        notificationsLabel: "Quelles notifications sont necessaires ?",
        notificationsPlaceholder:
          "ex. Rappels par email, alertes pour les urgences...",
      },
      files: {
        title: "Documents d'appui ?",
        description:
          "Joignez des fichiers pertinents — briefs, diagrammes, tableurs. Cette etape est optionnelle.",
        dropzone: "Glissez-deposez des fichiers ici, ou cliquez pour parcourir",
        maxSize: "Max 10 Mo par fichier",
        noFiles: "Aucun fichier telecharge",
        remove: "Supprimer",
      },
      review: {
        title: "Verifiez votre soumission",
        toolIdeaLabel: "Idee de logiciel",
        projectModeLabel: "Type de projet",
        userRolesLabel: "Types d'utilisateurs",
        accessControlLabel: "Permissions",
        keyWorkflowsLabel: "Processus cles",
        approvalsLabel: "Approbations",
        notificationsLabel: "Notifications",
        filesLabel: "Fichiers telecharges",
        noFiles: "Aucun",
        notProvided: "Non fourni",
        submit: "Generer mon plan",
        submitting: "Generation en cours...",
      },
      questions: {
        placeholder: "Tapez votre reponse ici",
        continue: "Continuer",
      },
      nav: {
        back: "Retour",
        next: "Suivant",
        saveProgress: "Sauvegarder",
      },
    },
    dashboard: {
      title: "Tableau de bord",
      generating: "Nos agents IA analysent vos donnees et generent votre plan...",
      vision: { title: "Vision", content: "" },
      requirements: {
        title: "Exigences",
        functional: "Exigences fonctionnelles",
        nonFunctional: "Exigences non-fonctionnelles",
        items: [],
        nfItems: [],
      },
      cost: {
        title: "Estimation des couts",
        effort: "Effort estime",
        effortValue: "",
        complexity: "Complexite",
        complexityValue: "",
        team: "Equipe suggeree",
        teamValue: "",
        breakdown: "Repartition de l'effort",
        phases: [],
      },
      competitive: {
        title: "Analyse concurrentielle",
        description: "",
        competitors: [],
        advantage: "",
      },
    },
    landing: {
      headline: "D'une idee brute a un\nplan pret a implementer",
      subtitle: "matura est un systeme d'IA agentique qui transforme un concept logiciel en une specification SDLC complete — vision, exigences, architecture, backlog, tests, et plus — en minutes, pas en semaines.",
      featureIdeaTitle: "De l'idee au plan en minutes",
      featureIdeaDesc: "Decrivez votre idee logicielle en langage naturel et obtenez un plan complet et pret a implementer genere par des agents IA.",
      featureLoopTitle: "Boucle de retro-feedback",
      featureLoopDesc: "Affinez n'importe quel artefact et observez les changements se propager automatiquement a travers la vision, les exigences, l'architecture et le backlog.",
      featureViewsTitle: "Vues business et techniques",
      featureViewsDesc: "Un pipeline, deux tableaux de bord. Les parties prenantes business voient les couts et l'analyse concurrentielle. Les ingenieurs voient l'architecture et les tests.",
      featureSdlcTitle: "Couverture SDLC complete",
      featureSdlcDesc: "Vision, exigences, architecture, frameworks, backlog, definitions de tests, estimations de couts et analyse concurrentielle.",
      footer: "Cree pour le Swiss Life Claude Builders Hackathon. Propulse par Claude.",
    },
    home: {
      welcome: "Bienvenue sur matura",
      subtitle: "Transformez n'importe quelle idee logicielle en un plan complet et pret a implementer.",
      totalProjects: "Total des projets",
      newFlow: "Nouveau flow",
      tipGenerate: "Chaque flow genere la vision, les exigences, l'architecture, le backlog, les tests, les estimations de couts et l'analyse concurrentielle.",
      tipRefine: "Affinez n'importe quel artefact dans le workspace et toutes les specifications associees se mettent a jour automatiquement via la boucle de retro-feedback.",
      yourFlows: "Vos Flows",
      createNewFlow: "Creer un nouveau flow",
      loading: "Chargement des projets...",
      noFlows: "Pas encore de flows. Lancez votre premier pour le voir ici.",
      createFirstFlow: "Creer votre premier flow",
      project: "Projet",
      mode: "Mode",
      created: "Cree le",
      actions: "Actions",
      workspace: "Workspace",
      internal: "Interne",
      external: "Externe",
    },
    workspace: {
      home: "Accueil",
      business: "Business",
      technical: "Technique",
      architecture: "Architecture",
      generating: "Generation en cours",
      externalMode: "Mode externe",
      internalMode: "Mode interne",
      generationFailed: "La generation a echoue",
      rateLimitError: "Limite de taux API atteinte — veuillez patienter un moment et reessayer.",
      authError: "Cle API invalide. Verifiez ANTHROPIC_API_KEY dans .env.local.",
      genericError: "Quelque chose s'est mal passe. Veuillez reessayer.",
      backToHome: "Retour a l'accueil",
      refinementsApplied: "affinement(s) applique(s) — artefacts synchronises",
      projectWorkspace: "Workspace du projet",
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export default translations;

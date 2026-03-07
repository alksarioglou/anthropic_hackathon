export type Locale = "en" | "de" | "fr";

export const defaultLocale: Locale = "en";

const translations = {
  en: {
    onboarding: {
      brandName: "ToolForge",
      steps: {
        start: "Start",
        requirements: "Requirements",
        dataModel: "Data Model",
        workflows: "Workflows",
        integrations: "Integrations",
        finish: "Finish",
      },
      welcome: {
        greeting: "Hello, {{name}}",
        description:
          "We'll guide you through a series of questions to understand what internal tool you need. Please describe your requirements in plain language — our AI will translate your business needs into a working application. The more detail you provide, the better the result.",
        saveNote:
          "At any point in time, you can save your progress and come back later to update your submission.",
        cta: "Let's get started!",
      },
      questions: {
        placeholder: "Type your answer here",
        continue: "Continue",
      },
      nav: {
        back: "Back",
        saveProgress: "Save Progress",
      },
    },
  },
  de: {
    onboarding: {
      brandName: "ToolForge",
      steps: {
        start: "Start",
        requirements: "Anforderungen",
        dataModel: "Datenmodell",
        workflows: "Workflows",
        integrations: "Integrationen",
        finish: "Abschluss",
      },
      welcome: {
        greeting: "Hallo, {{name}}",
        description:
          "Wir fuehren Sie durch eine Reihe von Fragen, um zu verstehen, welches interne Tool Sie benoetigen. Bitte beschreiben Sie Ihre Anforderungen in einfacher Sprache — unsere KI wird Ihre Geschaeftsanforderungen in eine funktionierende Anwendung uebersetzen. Je mehr Details Sie angeben, desto besser das Ergebnis.",
        saveNote:
          "Sie koennen jederzeit Ihren Fortschritt speichern und spaeter zurueckkommen, um Ihre Eingaben zu aktualisieren.",
        cta: "Los geht's!",
      },
      questions: {
        placeholder: "Geben Sie hier Ihre Antwort ein",
        continue: "Weiter",
      },
      nav: {
        back: "Zurueck",
        saveProgress: "Fortschritt speichern",
      },
    },
  },
  fr: {
    onboarding: {
      brandName: "ToolForge",
      steps: {
        start: "Debut",
        requirements: "Exigences",
        dataModel: "Modele de donnees",
        workflows: "Flux de travail",
        integrations: "Integrations",
        finish: "Terminer",
      },
      welcome: {
        greeting: "Bonjour, {{name}}",
        description:
          "Nous allons vous guider a travers une serie de questions pour comprendre quel outil interne vous avez besoin. Veuillez decrire vos exigences en langage simple — notre IA traduira vos besoins en une application fonctionnelle. Plus vous fournissez de details, meilleur sera le resultat.",
        saveNote:
          "A tout moment, vous pouvez sauvegarder votre progression et revenir plus tard pour mettre a jour votre soumission.",
        cta: "C'est parti !",
      },
      questions: {
        placeholder: "Tapez votre reponse ici",
        continue: "Continuer",
      },
      nav: {
        back: "Retour",
        saveProgress: "Sauvegarder",
      },
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export default translations;

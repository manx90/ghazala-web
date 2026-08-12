import fs from 'fs';

const enLegal = {
  homeAriaLabel: 'Ghazala - Home',
  lastUpdated: 'Last updated: {date}',
  tocAriaLabel: 'Table of contents',
  tocTitle: 'Page contents',
  footerCopyright: '© {year} Ghazala. All rights reserved.',
  termsLink: 'Terms of Service',
  privacyLink: 'Privacy Policy',
  terms: {
    title: 'Terms of Service',
    subtitle: 'Terms and conditions governing use of the Ghazala platform',
    lastUpdated: 'July 1, 2026',
    metaTitle: 'Terms of Service',
    metaDescription:
      'Terms and conditions governing use of the Ghazala platform for WhatsApp Business API communication.',
    intro:
      'These Terms of Service ("Terms") govern your access to and use of the Ghazala platform, an enterprise communication platform via the WhatsApp Business API. By using the platform, you agree to these Terms. If you do not agree, please stop using the service.',
    sections: [
      {
        id: 'acceptance',
        title: '1. Acceptance of Terms',
        paragraphs: [
          'Creating an account on Ghazala or using any of its services constitutes your explicit acceptance of these Terms and the associated Privacy Policy.',
          'If you use the platform on behalf of a company or other entity, you represent that you are legally authorized to bind that entity to these Terms. "You" and "Customer" refer to that entity.',
        ],
      },
      {
        id: 'service',
        title: '2. Description of Service',
        paragraphs: [
          'Ghazala provides infrastructure and software tools enabling organizations to manage WhatsApp Business conversations, including but not limited to:',
        ],
        list: [
          'Shared inbox for managing customer conversations across team members.',
          'Automation tools for replies and conversation routing.',
          'Creating and sending broadcast campaigns using Meta-approved templates.',
          'APIs and Webhooks for integration with external systems.',
          'Analytics dashboards and reports on conversation and campaign performance.',
        ],
      },
      {
        id: 'account',
        title: '3. Account and Registration',
        paragraphs: [
          'The Customer must provide accurate and up-to-date information when registering and must keep login credentials confidential.',
          'You are responsible for all activities under your account and must notify us immediately if you suspect unauthorized use.',
        ],
      },
      {
        id: 'billing',
        title: '4. Subscriptions and Payment',
        paragraphs: [
          'The service is offered under subscription plans with defined pricing and features. Fees are charged in advance according to the selected billing cycle.',
          'WhatsApp message pricing follows official Meta rates by conversation type and country. These costs are displayed transparently in the billing dashboard.',
          'Paid amounts for consumed periods are non-refundable except where required by law or at our discretion.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '5. Acceptable Use',
        paragraphs: ['Use of the platform is prohibited in any of the following cases:'],
        list: [
          'Sending spam or unwanted messages or violating WhatsApp Business policies.',
          'Publishing illegal, misleading, offensive, or rights-infringing content.',
          'Attempting unauthorized access to platform systems or other customers\' data.',
          'Reselling the service or sharing it with third parties without prior written consent.',
          'Using the service in any way that puts your WhatsApp number or the platform\'s reputation at risk.',
        ],
      },
      {
        id: 'meta-compliance',
        title: '6. WhatsApp and Meta Policy Compliance',
        paragraphs: [
          'Ghazala operates via the official WhatsApp Business API. Your use is also subject to Meta and WhatsApp Business and messaging policies.',
          'The Customer alone is responsible for obtaining required customer opt-in before messaging them, and any restrictions Meta imposes on your number due to policy violations.',
        ],
      },
      {
        id: 'ip',
        title: '7. Intellectual Property',
        paragraphs: [
          'All intellectual property rights in the platform, including software, designs, and trademarks, remain exclusively owned by Ghazala and its licensors.',
          'The Customer retains ownership of their data and conversation content and grants us a limited license to process it solely to provide and operate the service.',
        ],
      },
      {
        id: 'liability',
        title: '8. Limitation of Liability',
        paragraphs: [
          'The service is provided "as is" with our best efforts to ensure availability and stability. We do not guarantee it is completely error-free or uninterrupted.',
          'We are not liable for indirect or consequential damages, including loss of profits or data. Our total liability is limited to amounts paid in the twelve months preceding the claim.',
          'We are not responsible for Meta decisions regarding WhatsApp numbers, including quality restrictions or bans resulting from policy violations.',
        ],
      },
      {
        id: 'termination',
        title: '9. Termination',
        paragraphs: [
          'You may cancel your subscription at any time from account settings. The service remains active until the end of the current billing cycle.',
          'We may suspend or terminate accounts for Terms violations or service misuse, with notice when reasonably possible.',
        ],
      },
      {
        id: 'changes',
        title: '10. Changes to Terms',
        paragraphs: [
          'We may update these Terms from time to time and will notify you of material changes by email or in-platform notice before they take effect.',
          'Continued use after changes take effect constitutes acceptance of the updated Terms.',
        ],
      },
      {
        id: 'contact',
        title: '11. Contact',
        paragraphs: [
          'For questions about these Terms, contact us at support@ghazala.io and we will respond as soon as possible.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, and protect your data on the Ghazala platform',
    lastUpdated: 'July 1, 2026',
    metaTitle: 'Privacy Policy',
    metaDescription: 'How the Ghazala platform collects, uses, and protects your data.',
    intro:
      'Your privacy is a trust. This policy explains what data Ghazala collects, how we use it, how we protect it, and your rights to control it. By using the platform, you agree to the practices described here.',
    sections: [
      {
        id: 'data-we-collect',
        title: '1. Data We Collect',
        paragraphs: ['We collect the minimum data necessary to operate the service, including:'],
        list: [
          'Account data: name, email, and encrypted login credentials.',
          'Organization data: business name, linked WhatsApp numbers, and subscription settings.',
          'Service content: conversations, templates, and contacts you manage through the platform.',
          'Usage data: technical logs on how you interact with the platform to improve performance.',
          'Billing data: subscription and payment details (processed via secure payment providers; we do not store card data).',
        ],
      },
      {
        id: 'usage',
        title: '2. How We Use Data',
        paragraphs: ['We use collected data only for the following purposes:'],
        list: [
          'Providing and operating the service, including delivering messages via the official WhatsApp API.',
          'Managing your account, subscription, and payments.',
          'Improving the platform and developing new features based on usage patterns.',
          'Communicating important updates and security alerts.',
          'Complying with legal obligations and protecting our and users\' rights.',
        ],
      },
      {
        id: 'sharing',
        title: '3. Sharing Data with Third Parties',
        paragraphs: [
          'We never sell your data. We share minimal data with limited parties only when necessary:',
        ],
        list: [
          'Meta: to operate the WhatsApp Business API and deliver messages, subject to Meta privacy policies.',
          'Infrastructure providers: secure hosting and storage required to run the platform.',
          'Payment providers: to process subscriptions and billing securely.',
          'Legal authorities: when legally required or to protect our rights.',
        ],
      },
      {
        id: 'retention',
        title: '4. Data Retention',
        paragraphs: [
          'We retain your data while your account is active and for the period needed afterward to meet legal obligations and resolve disputes.',
          'You may request permanent deletion at any time. We will fulfill requests within a reasonable period unless legal obligations require retention.',
        ],
      },
      {
        id: 'security',
        title: '5. Data Security',
        paragraphs: ['We apply strict technical and organizational measures to protect your data, including:'],
        list: [
          'Encryption in transit (TLS) and at rest.',
          'Fine-grained access controls at role level within your organization and our teams.',
          'Audit logs for sensitive system operations.',
          'Continuous vulnerability monitoring and periodic security testing.',
        ],
      },
      {
        id: 'rights',
        title: '6. Your Rights',
        paragraphs: ['You have the following rights regarding your personal data:'],
        list: [
          'Access your data and obtain a copy.',
          'Correct inaccurate or incomplete data.',
          'Request deletion according to this policy.',
          'Object to or request restriction of certain processing.',
          'Withdraw consent where processing is consent-based, without affecting prior lawful processing.',
        ],
      },
      {
        id: 'cookies',
        title: '7. Cookies',
        paragraphs: [
          'We use essential cookies for session management and preferences such as theme. We do not use third-party advertising tracking cookies.',
          'You can control cookies in your browser settings. Disabling essential cookies may affect platform functionality.',
        ],
      },
      {
        id: 'transfers',
        title: '8. Cross-Border Data Transfers',
        paragraphs: [
          'Your data may be processed in data centers outside your country of residence according to our infrastructure providers\' locations. We apply appropriate safeguards consistent with applicable regulations.',
        ],
      },
      {
        id: 'changes',
        title: '9. Changes to This Policy',
        paragraphs: [
          'We may update this policy to reflect technical or regulatory developments. Updated versions will be posted on this page with a revised date.',
          'For material changes, we will notify you by email or prominent in-platform notice.',
        ],
      },
      {
        id: 'contact',
        title: '10. Privacy Contact',
        paragraphs: [
          'For privacy questions or requests, email privacy@ghazala.io and our privacy team will respond.',
        ],
      },
    ],
  },
};

fs.writeFileSync('messages/en/legal.json', JSON.stringify(enLegal, null, 2), 'utf8');
console.log('Generated messages/en/legal.json');

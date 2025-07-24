import React from 'react';
import { Shield, Lock, Eye, Users, Database, Globe, Mail, Phone } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                We are committed to protecting your privacy and ensuring transparency in how we collect, use, and protect your data. 
                This policy explains your rights and our practices regarding your personal information.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HomeListingAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our AI-powered real estate marketing platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our service, you consent to the data practices described in this policy. If you do not agree with our policies 
              and practices, please do not use our service.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-green-600" />
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li><strong>Account Information:</strong> Name, email address, phone number, company name</li>
              <li><strong>Property Information:</strong> Property details, photos, documents, descriptions</li>
              <li><strong>Contact Information:</strong> Agent details, client information for lead capture</li>
              <li><strong>Payment Information:</strong> Billing details, payment method information</li>
              <li><strong>Communication Data:</strong> Messages, chat transcripts, voice recordings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect certain information when you use our service:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Location Data:</strong> General location based on IP address</li>
              <li><strong>Cookies and Tracking:</strong> Session data, preferences, analytics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 AI Training Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To improve our AI systems, we may collect and process:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Uploaded documents and content for AI training</li>
              <li>Chat conversations and voice interactions</li>
              <li>User feedback and corrections</li>
              <li>Performance metrics and usage patterns</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-green-600" />
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Service Provision:</strong> Provide and maintain our AI-powered real estate tools</li>
              <li><strong>AI Training:</strong> Improve our AI models and response accuracy</li>
              <li><strong>Communication:</strong> Send service updates, support messages, and marketing communications</li>
              <li><strong>Lead Management:</strong> Process and manage real estate leads and inquiries</li>
              <li><strong>Analytics:</strong> Analyze usage patterns to improve our service</li>
              <li><strong>Compliance:</strong> Ensure compliance with legal obligations and regulations</li>
              <li><strong>Security:</strong> Protect against fraud, abuse, and security threats</li>
            </ul>
          </section>

          {/* 4. Information Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our service</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              <li><strong>Lead Sharing:</strong> With real estate agents and brokers for lead management (with consent)</li>
            </ul>
          </section>

          {/* 5. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-green-600" />
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data centers and infrastructure</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our AI systems (anonymized data)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Restriction:</strong> Request limitation of data processing</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@homelistingai.com
            </p>
          </section>

          {/* 8. International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-600" />
              8. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards 
              are in place to protect your data during international transfers, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Standard contractual clauses</li>
              <li>Adequacy decisions</li>
              <li>Other appropriate safeguards</li>
            </ul>
          </section>

          {/* 9. Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website usage and performance</li>
              <li>Provide personalized content and features</li>
              <li>Improve our service and user experience</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookie settings through your browser preferences. However, disabling cookies may affect service functionality.
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from 
              children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          {/* 11. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our service may contain links to third-party websites or integrate with third-party services. We are not responsible 
              for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* 12. Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Your continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 13. Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <p className="text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <strong>Email:</strong> privacy@homelistingai.com
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of the date listed above and applies to all users of HomeListingAI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 
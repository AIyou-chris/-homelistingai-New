import React from 'react';
import { Shield, AlertTriangle, FileText, Users, Lock, Scale } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Important Legal Notice</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                By using HomeListingAI, you agree to these terms. This service provides AI-powered real estate marketing tools. 
                Users are responsible for ensuring compliance with all applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using HomeListingAI ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* 2. Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              2. Service Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HomeListingAI provides AI-powered tools for real estate marketing, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>AI-generated property descriptions and marketing content</li>
              <li>Automated chat and voice assistants for property inquiries</li>
              <li>Lead capture and management tools</li>
              <li>Email marketing automation</li>
              <li>AI training and knowledge base management</li>
            </ul>
          </section>

          {/* 3. AI-Generated Content Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              3. AI-Generated Content Disclaimer
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>CRITICAL:</strong> AI-generated content is provided for assistance only and may contain inaccuracies, 
                incomplete information, or non-compliant content. Users must:
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Review and verify all AI-generated content before use</li>
              <li>Ensure compliance with local real estate laws and regulations</li>
              <li>Obtain professional legal and financial advice when needed</li>
              <li>Not rely solely on AI-generated content for decision-making</li>
              <li>Understand that AI responses are based on training data and may not reflect current market conditions</li>
            </ul>
          </section>

          {/* 4. User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              4. User Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Content Ownership:</strong> Ensuring you own or have rights to all uploaded content</li>
              <li><strong>Copyright Compliance:</strong> Not infringing on third-party intellectual property rights</li>
              <li><strong>Fair Housing Compliance:</strong> Adhering to all fair housing laws and regulations</li>
              <li><strong>MLS Rules:</strong> Following local MLS rules and guidelines</li>
              <li><strong>Professional Licensing:</strong> Maintaining valid real estate licenses where required</li>
              <li><strong>Data Accuracy:</strong> Providing accurate and truthful information</li>
              <li><strong>Professional Review:</strong> Reviewing all AI-generated content before use</li>
            </ul>
          </section>

          {/* 5. Real Estate Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-600" />
              5. Real Estate Compliance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users must ensure compliance with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Fair Housing Act and state/local fair housing laws</li>
              <li>Local MLS rules and regulations</li>
              <li>Real estate licensing requirements</li>
              <li>Truth in advertising laws</li>
              <li>Data privacy regulations (GDPR, CCPA, etc.)</li>
              <li>Professional real estate standards and ethics</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Disclaimer:</strong> This tool assists with marketing but does not replace professional legal, 
              financial, or real estate advice. Users should consult with licensed professionals for specific guidance.
            </p>
          </section>

          {/* 6. Data Usage and Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-600" />
              6. Data Usage and Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using our service, you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Grant us license to use uploaded content for service improvement</li>
              <li>Retain ownership of your content</li>
              <li>Agree to our Privacy Policy regarding data collection and usage</li>
              <li>Understand that data may be processed to improve AI systems</li>
              <li>Consent to receive service-related communications</li>
            </ul>
          </section>

          {/* 7. Prohibited Uses */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not use the service to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Upload copyrighted material without permission</li>
              <li>Generate discriminatory or non-compliant content</li>
              <li>Violate fair housing laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Attempt to reverse engineer or hack the service</li>
              <li>Use the service for illegal activities</li>
              <li>Share account credentials with unauthorized users</li>
            </ul>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>IMPORTANT:</strong> HomeListingAI is provided "as is" without warranties of any kind.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, HomeListingAI shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Inaccuracies in AI-generated content</li>
              <li>Loss of data or business opportunities</li>
              <li>Compliance violations or legal issues</li>
              <li>Service interruptions or technical issues</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Damages exceeding the amount paid for the service</li>
            </ul>
          </section>

          {/* 9. Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to indemnify and hold harmless HomeListingAI from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Your use of the service</li>
              <li>Violation of these terms</li>
              <li>Non-compliance with real estate laws</li>
              <li>Use of AI-generated content without proper review</li>
              <li>Infringement of third-party rights</li>
            </ul>
          </section>

          {/* 10. Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your access to the service immediately, without prior notice, for any reason, 
              including breach of these terms. Upon termination, your right to use the service will cease immediately.
            </p>
          </section>

          {/* 11. Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* 12. Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these terms, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@homelistingai.com<br />
                <strong>Address:</strong> [Your Business Address]<br />
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              These terms constitute the entire agreement between you and HomeListingAI regarding the use of the service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 
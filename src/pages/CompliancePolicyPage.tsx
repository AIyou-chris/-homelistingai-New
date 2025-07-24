import React from 'react';
import { Shield, Scale, Users, FileText, AlertTriangle, CheckCircle, Building, Globe } from 'lucide-react';

const CompliancePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compliance Policy</h1>
          <p className="text-lg text-gray-600">Real Estate Professional Standards & Legal Requirements</p>
        </div>

        {/* Important Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">Professional Compliance Required</h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                This policy outlines the legal and professional requirements for using HomeListingAI. All users must comply with 
                applicable real estate laws, fair housing regulations, and professional standards. Non-compliance may result in 
                account termination and legal consequences.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HomeListingAI is committed to promoting ethical and compliant real estate practices. This Compliance Policy outlines 
              the legal and professional requirements that all users must follow when using our AI-powered real estate marketing platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our service, you acknowledge that you are responsible for ensuring compliance with all applicable laws, 
              regulations, and professional standards in your jurisdiction.
            </p>
          </section>

          {/* 2. Fair Housing Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              2. Fair Housing Compliance
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>CRITICAL:</strong> Fair housing violations can result in severe legal penalties, including fines, 
                license suspension, and civil lawsuits.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Protected Classes</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under the Fair Housing Act and state/local laws, it is illegal to discriminate based on:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Race or color</li>
              <li>National origin</li>
              <li>Religion</li>
              <li>Sex (including gender identity and sexual orientation)</li>
              <li>Familial status (presence of children under 18)</li>
              <li>Disability</li>
              <li>Additional protected classes under state/local laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Prohibited Practices</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must not engage in discriminatory practices, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Using discriminatory language in property descriptions</li>
              <li>Steering clients to or away from certain neighborhoods</li>
              <li>Providing different services based on protected characteristics</li>
              <li>Using AI prompts that could generate discriminatory content</li>
              <li>Failing to accommodate reasonable disability requests</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 AI Content Review</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When using AI-generated content:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Review all AI-generated descriptions for discriminatory language</li>
              <li>Ensure property features are described neutrally</li>
              <li>Verify that neighborhood descriptions are inclusive</li>
              <li>Remove any content that could be interpreted as discriminatory</li>
            </ul>
          </section>

          {/* 3. MLS Rules and Regulations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-6 h-6 text-purple-600" />
              3. MLS Rules and Regulations
            </h2>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>IMPORTANT:</strong> MLS rules vary by location. You are responsible for knowing and following your local MLS rules.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Common MLS Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most MLS systems require:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Accurate and truthful property information</li>
              <li>Timely updates to listing status</li>
              <li>Proper photo and media guidelines</li>
              <li>Compliance with advertising standards</li>
              <li>Proper use of MLS data and photos</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Data Usage Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When using MLS data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Verify data accuracy before publishing</li>
              <li>Follow MLS photo and content usage rules</li>
              <li>Include required MLS disclaimers</li>
              <li>Respect copyright and intellectual property rights</li>
              <li>Update information when changes occur</li>
            </ul>
          </section>

          {/* 4. Professional Licensing Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              4. Professional Licensing Requirements
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 License Verification</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Maintain a valid real estate license in your jurisdiction</li>
              <li>Provide accurate license information in your profile</li>
              <li>Update license information when renewed or changed</li>
              <li>Comply with continuing education requirements</li>
              <li>Follow your state's real estate commission rules</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Professional Standards</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Maintain professional standards including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Honesty and integrity in all communications</li>
              <li>Confidentiality of client information</li>
              <li>Proper disclosure of material facts</li>
              <li>Avoiding conflicts of interest</li>
              <li>Maintaining professional appearance and conduct</li>
            </ul>
          </section>

          {/* 5. Truth in Advertising */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Truth in Advertising</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Accurate Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All property information must be:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Accurate and truthful</li>
              <li>Based on verifiable sources</li>
              <li>Updated when information changes</li>
              <li>Not misleading or deceptive</li>
              <li>Compliant with local advertising laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 AI-Generated Content Standards</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When using AI-generated content:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Verify all facts and figures before publishing</li>
              <li>Ensure descriptions match actual property features</li>
              <li>Review for accuracy and compliance</li>
              <li>Disclose when content is AI-generated if required</li>
              <li>Maintain human oversight of all marketing materials</li>
            </ul>
          </section>

          {/* 6. Data Privacy and Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              6. Data Privacy and Security
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Client Information Protection</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must protect client information by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Following data privacy laws (GDPR, CCPA, etc.)</li>
              <li>Securing client data and communications</li>
              <li>Obtaining proper consent for data collection</li>
              <li>Limiting data sharing to authorized parties</li>
              <li>Implementing appropriate security measures</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Lead Management Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When managing leads:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Follow Do Not Call (DNC) regulations</li>
              <li>Comply with CAN-SPAM Act for email marketing</li>
              <li>Respect opt-out requests promptly</li>
              <li>Maintain accurate lead records</li>
              <li>Use secure methods for data transmission</li>
            </ul>
          </section>

          {/* 7. State and Local Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-purple-600" />
              7. State and Local Requirements
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Real estate laws and regulations vary by state and locality. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Knowing and following your state's real estate laws</li>
              <li>Complying with local licensing requirements</li>
              <li>Following state-specific advertising regulations</li>
              <li>Understanding local fair housing ordinances</li>
              <li>Complying with state data privacy laws</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Recommendation:</strong> Consult with your local real estate association or legal counsel to ensure 
                compliance with all applicable laws in your jurisdiction.
              </p>
            </div>
          </section>

          {/* 8. AI-Specific Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. AI-Specific Compliance</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 AI Content Review Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When using AI-generated content, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Review all AI-generated content before publication</li>
              <li>Verify accuracy of property information</li>
              <li>Ensure compliance with fair housing laws</li>
              <li>Check for discriminatory language or bias</li>
              <li>Maintain human oversight and responsibility</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Training Data Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When uploading training data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Ensure you have rights to use the content</li>
              <li>Verify content complies with fair housing laws</li>
              <li>Remove any discriminatory or non-compliant content</li>
              <li>Follow copyright and intellectual property laws</li>
              <li>Maintain records of training data sources</li>
            </ul>
          </section>

          {/* 9. Monitoring and Enforcement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Monitoring and Enforcement</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Compliance Monitoring</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              HomeListingAI may:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Monitor content for compliance violations</li>
              <li>Review AI-generated content for accuracy</li>
              <li>Investigate reported violations</li>
              <li>Require corrective action for non-compliance</li>
              <li>Report serious violations to authorities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Consequences of Non-Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Violations may result in:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Account suspension or termination</li>
              <li>Removal of non-compliant content</li>
              <li>Reporting to regulatory authorities</li>
              <li>Legal action and liability</li>
              <li>Loss of professional license</li>
            </ul>
          </section>

          {/* 10. Best Practices */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              10. Best Practices
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Always review AI-generated content</li>
                  <li>Verify property information accuracy</li>
                  <li>Use inclusive and neutral language</li>
                  <li>Include required disclaimers</li>
                  <li>Keep content current and updated</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Conduct</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Maintain professional standards</li>
                  <li>Protect client confidentiality</li>
                  <li>Follow ethical guidelines</li>
                  <li>Stay informed about legal changes</li>
                  <li>Seek legal counsel when needed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 11. Resources and Support */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Resources and Support</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              For compliance support and resources:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>National Association of Realtors (NAR) Code of Ethics</li>
              <li>Your state's real estate commission</li>
              <li>Local real estate associations</li>
              <li>Fair housing organizations</li>
              <li>Legal counsel specializing in real estate law</li>
            </ul>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Contact:</strong> For compliance questions, contact us at compliance@homelistingai.com
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              This Compliance Policy is part of our Terms of Service and applies to all users of HomeListingAI. 
              Regular updates may be made to reflect changes in laws and regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePolicyPage; 
import React from 'react';
import { Shield, FileText, AlertTriangle, Mail, Phone, Clock, CheckCircle } from 'lucide-react';

const DMCAPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DMCA Policy</h1>
          <p className="text-lg text-gray-600">Digital Millennium Copyright Act Compliance</p>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Copyright Protection</h3>
              <p className="text-red-800 text-sm leading-relaxed">
                HomeListingAI respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). 
                This policy outlines our procedures for handling copyright infringement claims and content takedown requests.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HomeListingAI ("we," "our," or "us") respects the intellectual property rights of others and expects our users to do the same. 
              We comply with the Digital Millennium Copyright Act (DMCA) and other applicable copyright laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy outlines our procedures for handling copyright infringement claims, including how to submit a takedown notice 
              and how to file a counter-notice if your content has been removed.
            </p>
          </section>

          {/* 2. Copyright Infringement Notification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Copyright Infringement Notification</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 How to Submit a Takedown Notice</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you believe that content on our platform infringes your copyright, you may submit a DMCA takedown notice. 
              Your notice must include the following information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li><strong>Your Contact Information:</strong> Name, address, phone number, and email address</li>
              <li><strong>Copyright Owner:</strong> Name of the copyright owner or authorized representative</li>
              <li><strong>Description of Work:</strong> Detailed description of the copyrighted work being infringed</li>
              <li><strong>Infringing Content:</strong> Specific location/URL of the infringing content on our platform</li>
              <li><strong>Good Faith Statement:</strong> Statement that you believe the use is not authorized</li>
              <li><strong>Accuracy Statement:</strong> Statement that the information is accurate and you are authorized to act</li>
              <li><strong>Signature:</strong> Physical or electronic signature of the copyright owner or authorized representative</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Required Information Format</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Subject Line:</strong> DMCA Takedown Notice - [Your Name/Company]<br />
                <strong>Send to:</strong> dmca@homelistingai.com<br />
                <strong>Include:</strong> All required information listed above
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Sample Takedown Notice</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Sample Format:</strong><br />
                I, [Your Name], hereby give notice that I am the copyright owner of [Description of Work] and that the content at [URL] 
                infringes my copyright. I have a good faith belief that the use of the material is not authorized by the copyright owner, 
                its agent, or the law. I swear, under penalty of perjury, that the information in this notification is accurate and that 
                I am authorized to act on behalf of the copyright owner.
              </p>
            </div>
          </section>

          {/* 3. Our Response Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              3. Our Response Process
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Initial Review</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Upon receiving a DMCA takedown notice, we will:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Review the notice for completeness and compliance with DMCA requirements</li>
              <li>Verify that all required information is provided</li>
              <li>Assess the validity of the copyright claim</li>
              <li>Identify the specific content alleged to be infringing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Content Removal</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If the notice is valid and complete, we will:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Remove or disable access to the allegedly infringing content</li>
              <li>Notify the user who posted the content</li>
              <li>Provide information about the counter-notice process</li>
              <li>Maintain records of the takedown action</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Response Timeline</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm leading-relaxed">
                <strong>Typical Response Time:</strong> We aim to respond to valid DMCA notices within 24-48 hours. 
                Content removal typically occurs within 1-3 business days of receiving a complete notice.
              </p>
            </div>
          </section>

          {/* 4. Counter-Notice Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Counter-Notice Process</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Filing a Counter-Notice</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If your content has been removed due to a DMCA notice and you believe it was removed in error, you may file a counter-notice. 
              Your counter-notice must include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li><strong>Your Contact Information:</strong> Name, address, phone number, and email address</li>
              <li><strong>Content Identification:</strong> Description of the removed content and its location</li>
              <li><strong>Good Faith Statement:</strong> Statement that you believe the content was removed in error</li>
              <li><strong>Consent to Jurisdiction:</strong> Consent to local federal court jurisdiction</li>
              <li><strong>Accuracy Statement:</strong> Statement that the information is accurate under penalty of perjury</li>
              <li><strong>Signature:</strong> Physical or electronic signature</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Counter-Notice Processing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Upon receiving a valid counter-notice:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We will forward the counter-notice to the original complainant</li>
              <li>The complainant has 10-14 business days to file a lawsuit</li>
              <li>If no lawsuit is filed, we may restore the content</li>
              <li>We will notify both parties of the outcome</li>
            </ul>
          </section>

          {/* 5. Repeat Infringers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Repeat Infringers</h2>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Important:</strong> We maintain a policy of terminating accounts of users who are repeat infringers of copyright.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Our repeat infringer policy includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Tracking of DMCA violations per user account</li>
              <li>Warning system for first-time violations</li>
              <li>Account suspension for multiple violations</li>
              <li>Permanent account termination for repeat offenders</li>
              <li>Appeal process for account terminations</li>
            </ul>
          </section>

          {/* 6. False Claims */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. False Claims and Misrepresentation</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>Warning:</strong> Submitting false DMCA notices may result in legal consequences, including liability for damages 
                and attorney fees.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We take false claims seriously and may:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Investigate suspicious or false claims</li>
              <li>Report false claims to appropriate authorities</li>
              <li>Seek legal action against false claimants</li>
              <li>Maintain records of false claim attempts</li>
              <li>Implement measures to prevent future false claims</li>
            </ul>
          </section>

          {/* 7. Fair Use and Exceptions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Fair Use and Exceptions</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We recognize that some uses of copyrighted material may be protected under fair use or other exceptions. 
              When evaluating takedown notices, we consider:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>Purpose and character of the use (commercial vs. educational)</li>
              <li>Nature of the copyrighted work</li>
              <li>Amount and substantiality of the portion used</li>
              <li>Effect on the potential market for the original work</li>
              <li>Other applicable legal exceptions</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Note:</strong> Fair use determinations are complex and fact-specific. We encourage users to seek legal counsel 
                if they believe their use qualifies as fair use.
              </p>
            </div>
          </section>

          {/* 8. Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              For DMCA-related inquiries and notices:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <strong>Email:</strong> dmca@homelistingai.com
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <strong>Phone:</strong> [Your Phone Number]
              </p>
              <p className="text-gray-700">
                <strong>Mailing Address:</strong><br />
                [Your Business Address]<br />
                Attn: DMCA Agent
              </p>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm leading-relaxed">
                <strong>For General Copyright Questions:</strong> legal@homelistingai.com<br />
                <strong>For Technical Support:</strong> support@homelistingai.com
              </p>
            </div>
          </section>

          {/* 9. Additional Resources */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Additional Resources</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              For more information about copyright law and DMCA compliance:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>U.S. Copyright Office: <a href="https://www.copyright.gov" className="text-blue-600 hover:underline">www.copyright.gov</a></li>
              <li>DMCA Information: <a href="https://www.copyright.gov/dmca" className="text-blue-600 hover:underline">www.copyright.gov/dmca</a></li>
              <li>Fair Use Guidelines: <a href="https://www.copyright.gov/fair-use" className="text-blue-600 hover:underline">www.copyright.gov/fair-use</a></li>
              <li>Legal Counsel: Consult with an attorney specializing in intellectual property law</li>
            </ul>
          </section>

          {/* 10. Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Policy Updates</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this DMCA Policy from time to time to reflect changes in law or our practices. 
              Updates will be posted on this page with a new effective date.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for reviewing this policy periodically to stay informed about our DMCA procedures.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                This DMCA Policy is effective as of {new Date().toLocaleDateString()} and applies to all users of HomeListingAI.
              </p>
              <p className="text-xs text-gray-400">
                This policy is provided for informational purposes only and does not constitute legal advice. 
                For legal questions, please consult with an attorney.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMCAPolicyPage; 
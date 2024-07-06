'use client'
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Subsection {
  id: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  title: string;
  subsections?: Subsection[];
  content?: string;
}

const termsAndConditionsData = [
  {
    id: 'introduction',
    title: '1. Introduction',
    subsections: [
      {
        id: 'contract',
        title: '1.1 Contract',
        content: 'By using our services, you agree to the terms of this User Agreement, our Privacy Policy, and our Cookie Policy. By clicking "Sign Up", "Join Now", or similar, or by using our services, you enter into a legally binding contract with Techihub, registered as Techily Tech Hub Ltd in Kenya. If you do not agree, do not use our services.'
      },
      {
        id: 'services',
        title: '1.2 Services',
        content: 'This agreement applies to Techily Tech Hub Ltd, Techihub.io, Techihub-branded apps, and other Techihub-related sites, apps, communications, and services that state they are offered under this agreement ("Services"). Users of our services are "Members" or "Visitors".'
      },
      {
        id: 'change',
        title: '1.3 Change',
        content: 'We may modify this agreement, our Privacy Policy, and our Cookie Policy. We will notify you of material changes to give you an opportunity to review before they take effect. If you object to changes, you can opt to close your account. Continued use of our services means you consent to the updated terms.'
      }
    ]
  },
  {
    id: 'obligations',
    title: '2. Obligations',
    subsections: [
      {
        id: 'service-eligibility',
        title: '2.1 Service Eligibility',
        content: 'You must be at least 18 years old to use our services. You will only have one Techihub account and it must be in your real name. Exemption shall be made for the individuals registered as minors and under the community of upcoming developers currently branded as Devs Under 20 on the community page or whose countries recognize the age below 18 as adults.'
      },
      {
        id: 'your-account',
        title: '2.2 Your Account',
        content: 'You are responsible for maintaining the confidentiality of your password and account. You may not transfer your account to others.'
      },
      {
        id: 'payment',
        title: '2.3 Payment',
        content: 'If you purchase our paid services, you agree to pay the applicable fees and taxes. Failure to pay may result in termination of your services and legal suit in extreme circumstances.'
      },
      {
        id: 'notices-and-messages',
        title: '2.4 Notices and Messages',
        content: 'You agree to receive notices and messages through our websites, apps, and contact information. Keep your contact information up to date.'
      },
      {
        id: 'sharing',
        title: '2.5 Sharing',
        content: 'When you share information, others can see, copy, and use it. We are not obligated to publish any information and can remove it with or without notice.'
      }
    ]
  },
  {
    id: 'rights-and-limits',
    title: '3. Rights and Limits',
    subsections: [
      {
        id: 'license-to-techihub',
        title: '3.1 Your License to Techihub',
        content: 'You own the content you provide but grant Techihub a non-exclusive license to use, copy, modify, distribute, publish, and process it.'
      },
      {
        id: 'service-availability',
        title: '3.2 Service Availability',
        content: 'We may change, suspend, or discontinue any of our services. We are not obligated to store your content and information.'
      },
      {
        id: 'other-content',
        title: '3.3 Other Content, Sites, and Apps',
        content: "Your use of others' content is at your own risk. We are not responsible for third-party activities or services."
      },
      {
        id: 'limits',
        title: '3.4 Limits',
        content: 'We may limit your use of the services, including the ability to contact other members without consent. Use of in-appropriate language is prohibited. We may restrict, suspend, or terminate your account if you breach this agreement or the law.'
      },
      {
        id: 'intellectual-property',
        title: '3.5 Intellectual Property Rights',
        content: 'Techihub reserves all of its intellectual property rights in the services. Trademarks and logos used in connection with the services are the trademarks of their respective owners.'
      },
      {
        id: 'automated-processing',
        title: '3.6 Automated Processing',
        content: 'We use data and information about you to make relevant suggestions to you and others.'
      }
    ]
  },
  {
    id: 'disclaimer-and-limitation',
    title: '4. Disclaimer and Limitation of Liability',
    subsections: [
      {
        id: 'no-warranty',
        title: '4.1 No Warranty',
        content: 'Techihub provides the services on an "as is" and "as available" basis. To the fullest extent permitted by law, Techihub disclaims all warranties.'
      },
      {
        id: 'exclusion-of-liability',
        title: '4.2 Exclusion of Liability',
        content: 'To the fullest extent permitted by law, Techihub will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, opportunities, reputation, or profits relating to the services.'
      }
    ]
  },
  {
    id: 'termination',
    title: '5. Termination',
    content: 'Both you and Techihub may terminate this agreement at any time with notice to the other. Upon termination, you lose the right to access or use the services.'
  },
  {
    id: 'governing-law',
    title: '6. Governing Law and Dispute Resolution',
    content: 'This agreement will be governed by and constituted in accordance with the laws of The Republic of Kenya., excluding its conflict of law principles. Any legal actions or proceedings related to this agreement will be brought exclusively in the courts located in Nairobi County, Kenya.'
  },
  {
    id: 'general-terms',
    title: '7. General Terms',
    content: 'If any provision of this agreement is found to be unenforceable, the remaining provisions will remain in full force and effect. This agreement constitutes the entire agreement between you and Techihub regarding the services and supersedes any prior agreements.'
  },
  {
    id: 'dos-and-donts',
    title: "8. Techihub 'Dos and Don'ts",
    subsections: [
      {
        id: 'dos',
        title: '8.1 Dos',
        content: 'Comply with all applicable laws. Provide accurate information and keep it updated. Use your real name on your profile. Use the services in a professional manner.'
      },
      {
        id: 'donts',
        title: "8.2 Don'ts",
        content: "Create a false identity or use another's account. Use software, devices, or other means to scrape the services or copy data. Violate intellectual property rights. Post harmful software, code or content that is inappropriate. Interfere with the operation of the services."
      }
    ]
  },
  {
    id: 'complaints',
    title: '9. Complaints Regarding Content',
    content: 'We respect intellectual property rights and require that content posted by members be accurate and not in violation of third-party rights. We provide a policy and process for complaints concerning content posted by our members.'
  },
  {
    id: 'contact',
    title: '10. How to Contact Us',
    content: 'For general inquiries, contact us online. For legal notices or service of process, write to us at:\n\nTECHILY TECH HUB LTD\nlegal@techihub.io or info@techihub.io\nNairobi, Kenya.'
  }
];

const TermsAndConditions = () => {
  const sectionRefs: { [key: string]: React.RefObject<HTMLElement> } = termsAndConditionsData.reduce((acc, section) => {
    acc[section.id] =  useRef<HTMLElement>(null);
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLElement> });

  const scrollToSection = (sectionKey: string) => {
    sectionRefs[sectionKey].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-medium mb-6">Techihub User Agreement</h1>
      <p className="mb-4">Effective Date: Jan 01, 2024</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className=" list-inside">
            {termsAndConditionsData.map((section) => (
              <li key={section.id}>
                <button 
                  onClick={() => scrollToSection(section.id)} 
                  className="text-blue-600 hover:underline text-left w-full block whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {termsAndConditionsData.map((section) => (
        <section key={section.id} ref={sectionRefs[section.id]} className="mb-8">
          <h2 className="font-medium mb-4">{section.title}</h2>
          {section.subsections ? (
            section.subsections.map((subsection) => (
              <div key={subsection.id} className="mb-6">
                <h3 className=" font-medium mb-2">{subsection.title}</h3>
                <p className="mb-4">{subsection.content}</p>
              </div>
            ))
          ) : (
            <p className="mb-4">{section.content}</p>
          )}
        </section>
      ))}
    </div>
  );
};

export default TermsAndConditions;
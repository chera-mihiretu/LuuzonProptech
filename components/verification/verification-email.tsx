import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  EmailElementProps,
} from '@react-email/components';

interface EmailBody {
    name: string, 
    url: string
}


const EmailVerification = (props : EmailBody) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your email address to complete your registration</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
            <Section>
              <Heading className="text-[28px] font-bold text-gray-900 mb-[24px] text-center">
                Moto Luuzon Proptech
              </Heading>
              
              <Heading className="text-[24px] font-bold text-gray-800 mb-[16px]">
                Verify Your Email Address
              </Heading>
              
              <Text className="text-[16px] text-gray-600 mb-[24px] leading-[24px]">
                Hi {props.name} ! 
                Thank you for signing up with Moto Luuzon Proptech! To complete your registration and secure your account, please verify your email address by clicking the button below.
              </Text>
              
              <Section className="text-center mb-[32px]">
                <Button
                  href={props.url}
                  className="bg-black text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>
              
              <Text className="text-[14px] text-gray-500 mb-[16px]">
                If the button above doesn't work, you can also{' '}
                <Link href={props.url} className="text-black underline">
                  click here
                </Link>{' '}
                to verify your email address.
              </Text>
              
              <Text className="text-[14px] text-gray-500 mb-[24px]">
                This verification link will expire in 24 hours for security reasons. If you didn't create an account with Moto Luuzon Proptech, you can safely ignore this email.
              </Text>
              
              <Text className="text-[14px] text-gray-500">
                Best regards,<br />
                The Moto Luuzon Proptech Team
              </Text>
            </Section>
            
            <Section className="border-t border-gray-200 pt-[24px] mt-[32px]">
              <Text className="text-[12px] text-gray-400 text-center m-0">
                Moto Luuzon Proptech<br />
                123 Property Street, Real Estate District<br />
                Addis Ababa, Ethiopia
              </Text>
              
              <Text className="text-[12px] text-gray-400 text-center mt-[16px] m-0">
                © {new Date().getFullYear()} Moto Luuzon Proptech. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default EmailVerification;
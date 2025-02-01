import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  // Button,
} from "@react-email/components";

interface VerficationEmailProps {
  username: string;
  otp: string;
}

export default function VerficationEmail({
  username,
  otp,
}: VerficationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font fontFamily="Arial" fallbackFontFamily="sans-serif" />
      </Head>
      <Preview>Here&apos;s your verification code {otp}</Preview>
      <Section>
        <Row>
            <Heading as="h2">Hello {username} 👋</Heading>
        </Row>
        <Row>
            <Text>
                Thank you for registering. Please use the following verfication code to complete your registration
            </Text>
        </Row>
        <Row>
            <Text>
                {otp}
                <br />
                This code will expire in 5 minutes. Please don&apos;t share it with anyone.
            </Text>
        </Row>
        <Row>
            <Text>
                if you did not request this code, please ignore this email.
            </Text>
        </Row>
      </Section>
    </Html>
  );
}

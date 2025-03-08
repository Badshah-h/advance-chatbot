import React from "react";
import RichCard, {
  createLocationDetail,
  createDateDetail,
  createTimeDetail,
  createFeeDetail,
} from "../components/RichCard";
import { ExternalLink, Download, Calendar } from "lucide-react";

export default {
  title: "Components/RichCard",
  component: RichCard,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => (
  <div className="w-96">
    <RichCard
      title="Tourist Visa Application"
      description="Short-term visa for tourists visiting the UAE"
      badge={{ text: "Popular", variant: "default" }}
      details={[
        createLocationDetail("Federal Authority for Identity and Citizenship"),
        createDateDetail("Valid for 30 days from entry"),
        createFeeDetail("AED 500"),
      ]}
      actions={[
        {
          label: "Apply Online",
          href: "#",
          variant: "default",
        },
        {
          label: "View Requirements",
          variant: "outline",
        },
      ]}
      footer="Last updated: January 15, 2023"
    />
  </div>
);

export const WithImage = () => (
  <div className="w-96">
    <RichCard
      title="Golden Visa Program"
      description="Long-term residence visa for investors and talented individuals"
      image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80"
      badge={{ text: "New", variant: "default" }}
      details={[
        createLocationDetail("Dubai Department of Economic Development"),
        createDateDetail("Valid for 10 years"),
        createFeeDetail("Starting from AED 2,500"),
      ]}
      actions={[
        {
          label: "Check Eligibility",
          href: "#",
          variant: "default",
        },
        {
          label: "Download Guide",
          icon: <Download className="h-4 w-4 mr-1" />,
          variant: "outline",
        },
      ]}
    />
  </div>
);

export const EventCard = () => (
  <div className="w-96">
    <RichCard
      title="UAE National Day Celebration"
      description="Join us for the 52nd UAE National Day celebrations"
      image="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&q=80"
      badge={{ text: "Event", variant: "secondary" }}
      details={[
        createLocationDetail("Dubai Downtown, Burj Park"),
        createDateDetail("December 2, 2023"),
        createTimeDetail("5:00 PM - 10:00 PM"),
      ]}
      actions={[
        {
          label: "Register",
          variant: "default",
        },
        {
          label: "Add to Calendar",
          icon: <Calendar className="h-4 w-4 mr-1" />,
          variant: "outline",
        },
      ]}
      footer="Free entry for all UAE residents and citizens"
    />
  </div>
);

export const MinimalCard = () => (
  <div className="w-96">
    <RichCard
      title="Emirates ID Renewal"
      description="Renew your Emirates ID before expiry"
      details={[createFeeDetail("AED 300 (3 years validity)")]}
      actions={[
        {
          label: "Renew Online",
          href: "#",
          variant: "default",
        },
      ]}
    />
  </div>
);

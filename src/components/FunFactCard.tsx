import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";
import { ExternalLinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchCityFunFact, getRandomFallbackFact, FunFact } from "../api/wiki";

interface FunFactCardProps {
  cityName: string;
  countryCode?: string;
}

export function FunFactCard({ cityName, countryCode }: FunFactCardProps) {
  const [funFact, setFunFact] = useState<FunFact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeClass, setFadeClass] = useState("");

  const loadFunFact = async (force = false) => {
    if (!force && funFact) return;

    setLoading(true);
    setError(null);
    setFadeClass("fade-out");

    try {
      const fact = await fetchCityFunFact(cityName, countryCode);
      
      // Add a small delay for animation effect
      setTimeout(() => {
        setFunFact(fact);
        setFadeClass("fade-in");
        setLoading(false);
      }, 300);
    } catch (err: any) {
      console.error("Error fetching fun fact:", err);
      setError("Failed to load fun fact");
      setFunFact(getRandomFallbackFact());
      setFadeClass("fade-in");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunFact(true);
  }, [cityName, countryCode]);

  if (loading && !funFact) {
    return (
      <Card 
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          minHeight: "200px"
        }}
      >
        <CardBody style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "2rem" 
        }}>
          <Loader type="infinite-spinner" />
          <span style={{ marginLeft: "1rem" }}>Loading fun fact...</span>
        </CardBody>
      </Card>
    );
  }

  if (!funFact) {
    return (
      <Card 
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <CardBody style={{ padding: "2rem", textAlign: "center" }}>
          <p>No fun facts available</p>
          <Button onClick={() => loadFunFact(true)} disabled={loading}>
            Try Again
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <style>
        {`
          .fade-in {
            opacity: 1;
            transition: opacity 0.3s ease-in;
          }
          .fade-out {
            opacity: 0.3;
            transition: opacity 0.3s ease-out;
          }
          .fun-fact-image {
            max-width: 150px;
            max-height: 120px;
            border-radius: 8px;
            object-fit: cover;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .fun-fact-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          .fun-fact-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
        `}
      </style>
      
      <Card 
        className={`fun-fact-card ${fadeClass}`}
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "800px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}
        role="article"
        aria-label="Fun fact about the current city"
      >
        <CardHeader style={{ 
          textAlign: "center", 
          fontWeight: "bold", 
          padding: "1.5rem 1.5rem 1rem",
          background: "rgba(255,255,255,0.1)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px"
        }}>
          <CardTitle style={{ 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "0.5rem" 
          }}>
            Did You Know?
          </CardTitle>
        </CardHeader>
        
        <CardBody style={{ padding: "1.5rem", textAlign: "center" }}>
          {funFact.image && (
            <div style={{ marginBottom: "1.5rem" }}>
              <img 
                src={funFact.image} 
                alt="Related image" 
                className="fun-fact-image"
                style={{ maxWidth: "300px", maxHeight: "200px" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div style={{ textAlign: "justify" }}>
            <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: "0 0 1rem 0" }}>
              {funFact.text}
            </p>
          </div>
          <div style={{ 
                fontSize: "0.8rem", 
                opacity: 0.8, 
                marginBottom: "1.5rem",
                fontStyle: "italic"
              }}>
                Source: {funFact.source}
          </div>
        </CardBody>
      </Card>

      {error && (
        <Notification 
          type={{ style: "warning", icon: true }}
          closable
          onClose={() => setError(null)}
        >
          {error}
        </Notification>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Animated Text Cycle Component
interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  style?: any;
}

function AnimatedTextCycle({
  words,
  interval = 3000,
  style
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length, fadeAnim]);

  return (
    <Animated.Text style={[style, { opacity: fadeAnim }]}>
      {words[currentIndex]}
    </Animated.Text>
  );
}

// Testimonial Card Component
interface TestimonialAuthor {
  name: string;
  handle: string;
}

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  style?: any;
}

function TestimonialCard({ 
  author,
  text,
  style
}: TestimonialCardProps) {
  return (
    <View style={[styles.testimonialCard, style]}>
      <View style={styles.testimonialHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{author.name.charAt(0)}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.authorHandle}>{author.handle}</Text>
        </View>
      </View>
      <Text style={styles.testimonialText}>{text}</Text>
    </View>
  );
}

// Main Website Component
export default function ReceiptScannerWebsite() {
  const router = useRouter();
  const [menuState, setMenuState] = useState(false);

  const testimonials = [
    {
      author: {
        name: "Sarah Chen",
        handle: "Small Business Owner"
      },
      text: "ReceiptScanner Pro has transformed how I manage expenses. The AI accuracy is incredible - it catches every detail from my receipts.",
    },
    {
      author: {
        name: "Mike Rodriguez",
        handle: "Freelance Consultant"
      },
      text: "Perfect for tax season! I can scan all my receipts and get organized reports instantly. Saves me hours every month.",
    },
    {
      author: {
        name: "Emma Thompson",
        handle: "Travel Blogger"
      },
      text: "The receipt scanning feature is a game-changer. Just snap a photo and it automatically extracts everything. Love it!",
    },
    {
      author: {
        name: "David Park",
        handle: "Restaurant Manager"
      },
      text: "We use it daily for expense tracking. The cloud sync means I can access everything from anywhere. Highly recommend!",
    }
  ];

  const features = [
    {
      icon: 'camera-alt',
      title: "AI-Powered OCR",
      description: "Advanced AI technology extracts text from any receipt with 99% accuracy"
    },
    {
      icon: 'flash-on',
      title: "Lightning Fast",
      description: "Process receipts in seconds, not minutes"
    },
    {
      icon: 'security',
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties"
    },
    {
      icon: 'cloud',
      title: "Cloud Sync",
      description: "Access your receipts anywhere, anytime across all devices"
    },
    {
      icon: 'headset-mic',
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team"
    },
    {
      icon: 'trending-up',
      title: "Smart Analytics",
      description: "Get insights into your spending patterns and financial trends"
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['5 receipts per month', 'Basic OCR', 'Email support'],
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: ['Unlimited receipts', 'Advanced AI OCR', 'Analytics dashboard', 'Priority support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: '/month',
      features: ['Team management', 'Custom integrations', 'API access', 'Dedicated support'],
      popular: false
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logo}>
            <MaterialIcons name="receipt" size={24} color="#6366f1" />
            <Text style={styles.logoText}>ReceiptScanner Pro</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuState(!menuState)}
          >
            <MaterialIcons name={menuState ? "close" : "menu"} size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>
        {menuState && (
          <View style={styles.mobileMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Contact</Text>
            </TouchableOpacity>
            <View style={styles.menuButtons}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => router.push('/scan')}
              >
                <Text style={styles.primaryButtonText}>Start Scanning</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New: AI-Powered Receipt Scanning</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#6366f1" />
          </View>
          
          <Text style={styles.heroTitle}>
            Transform Your{' '}
            <AnimatedTextCycle 
              words={[
                "receipts",
                "expenses", 
                "documents",
                "invoices"
              ]}
              interval={3000}
              style={styles.highlightText}
            />{' '}
            into smart data
          </Text>
          
          <Text style={styles.heroSubtitle}>
            The most advanced AI-powered receipt scanner that turns paper receipts into actionable insights. 
            Save time, track expenses, and make better financial decisions.
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.heroPrimaryButton}
              onPress={() => router.push('/scan')}
            >
              <Text style={styles.heroPrimaryButtonText}>Start Scanning Now</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroSecondaryButton}>
              <Text style={styles.heroSecondaryButtonText}>Watch Demo</Text>
              <MaterialIcons name="play-circle-outline" size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.heroImage}>
          <View style={styles.mockupPhone}>
            <View style={styles.phoneScreen}>
              <View style={styles.receiptPreview}>
                <MaterialIcons name="receipt" size={48} color="#6366f1" />
                <Text style={styles.receiptText}>ReceiptScanner Pro</Text>
                <Text style={styles.receiptSubtext}>AI-Powered OCR Technology</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1M+</Text>
            <Text style={styles.statLabel}>Receipts Processed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>Accuracy Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Happy Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Everything you need for receipt management</Text>
          <Text style={styles.sectionSubtitle}>Simple, fast, and accurate receipt scanning for any business</Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialIcons name={feature.icon as any} size={32} color="#6366f1" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pricing Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Simple, Transparent Pricing</Text>
          <Text style={styles.sectionSubtitle}>Choose the plan that fits your needs. No hidden fees, cancel anytime.</Text>
        </View>
        
        <View style={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <View key={index} style={[styles.pricingCard, plan.popular && styles.popularCard]}>
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>{plan.period}</Text>
              </View>
              <View style={styles.planFeatures}>
                {plan.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={styles.planFeature}>
                    <MaterialIcons name="check" size={16} color="#10b981" />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={[styles.pricingButton, plan.popular && styles.popularButton]}
                onPress={() => router.push('/scan')}
              >
                <Text style={[styles.pricingButtonText, plan.popular && styles.popularButtonText]}>
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Loved by businesses worldwide</Text>
          <Text style={styles.sectionSubtitle}>Join thousands who have simplified their receipt management</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsContainer}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              {...testimonial}
              style={styles.testimonialCard}
            />
          ))}
        </ScrollView>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Ready to Transform Your Receipt Management?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of users who are already saving time and money with our AI-powered receipt scanner.
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/scan')}
          >
            <Text style={styles.ctaButtonText}>Start Your Free Trial</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.ctaNote}>No credit card required • 14-day free trial</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>ReceiptScanner Pro</Text>
            <Text style={styles.footerDescription}>
              The most advanced AI-powered receipt scanner for businesses and individuals.
            </Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Product</Text>
            <Text style={styles.footerLink}>Features</Text>
            <Text style={styles.footerLink}>Pricing</Text>
            <Text style={styles.footerLink}>API</Text>
            <Text style={styles.footerLink}>Documentation</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Company</Text>
            <Text style={styles.footerLink}>About</Text>
            <Text style={styles.footerLink}>Blog</Text>
            <Text style={styles.footerLink}>Careers</Text>
            <Text style={styles.footerLink}>Contact</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Support</Text>
            <Text style={styles.footerLink}>Help Center</Text>
            <Text style={styles.footerLink}>Status</Text>
            <Text style={styles.footerLink}>Privacy</Text>
            <Text style={styles.footerLink}>Terms</Text>
          </View>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerCopyright}>© 2024 ReceiptScanner Pro. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  menuButton: {
    padding: 8,
  },
  mobileMenu: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 20,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#64748b',
  },
  menuButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  hero: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 60,
    backgroundColor: '#f8fafc',
  },
  heroContent: {
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    color: '#1e293b',
    marginRight: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 20,
  },
  highlightText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  heroPrimaryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  heroSecondaryButton: {
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroSecondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  heroImage: {
    alignItems: 'center',
  },
  mockupPhone: {
    width: 280,
    height: 560,
    backgroundColor: '#1e293b',
    borderRadius: 40,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptPreview: {
    alignItems: 'center',
    padding: 20,
  },
  receiptText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  receiptSubtext: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  statsSection: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  pricingGrid: {
    gap: 20,
  },
  pricingCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  popularCard: {
    borderColor: '#6366f1',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -60,
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  period: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  planFeatures: {
    marginBottom: 24,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  pricingButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#6366f1',
  },
  pricingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  popularButtonText: {
    color: '#ffffff',
  },
  testimonialsContainer: {
    paddingHorizontal: 20,
  },
  testimonialCard: {
    width: 280,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  authorHandle: {
    fontSize: 12,
    color: '#64748b',
  },
  testimonialText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaNote: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  footerContent: {
    marginBottom: 20,
  },
  footerSection: {
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

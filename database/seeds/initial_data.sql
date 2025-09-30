-- Initial data for SaaS Funnel Builder
-- Insert default templates and sample data

-- Insert default funnel templates
INSERT INTO templates (id, name, description, category, configuration, is_premium, is_active) VALUES
(
    uuid_generate_v4(),
    'Dating Funnel',
    'Complete dating funnel with video steps and lead capture',
    'dating',
    '{
        "steps": [
            {
                "id": "intro",
                "type": "video",
                "title": "Welcome Video",
                "videoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4",
                "mobileVideoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1753695869/intromobile.mp4",
                "question": "Welcome to our platform",
                "options": [{"label": "Let''s Start", "next": "over18"}]
            },
            {
                "id": "over18",
                "type": "video",
                "title": "Age Verification",
                "videoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1752741384/over18.mp4",
                "mobileVideoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1753695856/over18mobile.mp4",
                "question": "Are you over 18 years old?",
                "options": [
                    {"label": "Yes", "next": "single"},
                    {"label": "No", "next": "disqualify"}
                ]
            },
            {
                "id": "single",
                "type": "video",
                "title": "Relationship Status",
                "videoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1752741400/single.mp4",
                "mobileVideoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1753695866/singlemobile.mp4",
                "question": "Are you single?",
                "options": [
                    {"label": "Yes", "next": "gender"},
                    {"label": "No", "next": "disqualify"}
                ]
            },
            {
                "id": "gender",
                "type": "video",
                "title": "Gender Selection",
                "videoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1752741386/gender.mp4",
                "mobileVideoUrl": "https://res.cloudinary.com/domnocrwi/video/upload/v1753695859/gendermobile.mp4",
                "question": "What''s your gender?",
                "options": [
                    {"label": "Female", "next": "redirect"},
                    {"label": "Male", "next": "ready"}
                ]
            },
            {
                "id": "form",
                "type": "form",
                "title": "Lead Capture",
                "fields": [
                    {"name": "name", "type": "text", "label": "Full Name", "required": true},
                    {"name": "email", "type": "email", "label": "Email Address", "required": true},
                    {"name": "phone", "type": "tel", "label": "Phone Number", "required": true}
                ]
            }
        ],
        "branding": {
            "primaryColor": "#2E2A76",
            "secondaryColor": "#C2A9C8",
            "accentColor": "#FF6B6B"
        }
    }',
    false,
    true
),
(
    uuid_generate_v4(),
    'E-commerce Funnel',
    'Product sales funnel with pricing and checkout',
    'ecommerce',
    '{
        "steps": [
            {
                "id": "intro",
                "type": "video",
                "title": "Product Introduction",
                "question": "Welcome to our product showcase",
                "options": [{"label": "Learn More", "next": "features"}]
            },
            {
                "id": "features",
                "type": "video",
                "title": "Product Features",
                "question": "Here are the key features of our product",
                "options": [{"label": "See Pricing", "next": "pricing"}]
            },
            {
                "id": "pricing",
                "type": "pricing",
                "title": "Pricing Plans",
                "plans": [
                    {"name": "Basic", "price": 29, "features": ["Feature 1", "Feature 2"]},
                    {"name": "Pro", "price": 59, "features": ["All Basic", "Feature 3", "Feature 4"]},
                    {"name": "Enterprise", "price": 99, "features": ["All Pro", "Feature 5", "Feature 6"]}
                ]
            },
            {
                "id": "checkout",
                "type": "form",
                "title": "Checkout Form",
                "fields": [
                    {"name": "name", "type": "text", "label": "Full Name", "required": true},
                    {"name": "email", "type": "email", "label": "Email", "required": true},
                    {"name": "card", "type": "text", "label": "Card Number", "required": true}
                ]
            }
        ]
    }',
    false,
    true
),
(
    uuid_generate_v4(),
    'Lead Generation Funnel',
    'Simple lead capture funnel',
    'leadgen',
    '{
        "steps": [
            {
                "id": "intro",
                "type": "video",
                "title": "Welcome",
                "question": "Get your free consultation",
                "options": [{"label": "Get Started", "next": "form"}]
            },
            {
                "id": "form",
                "type": "form",
                "title": "Contact Information",
                "fields": [
                    {"name": "name", "type": "text", "label": "Name", "required": true},
                    {"name": "email", "type": "email", "label": "Email", "required": true},
                    {"name": "company", "type": "text", "label": "Company", "required": false}
                ]
            },
            {
                "id": "thankyou",
                "type": "video",
                "title": "Thank You",
                "question": "Thank you for your interest! We''ll be in touch soon."
            }
        ]
    }',
    false,
    true
);

-- Insert default avatars
INSERT INTO avatars (id, name, avatar_id, gender, age_range, ethnicity, style, is_custom, is_active) VALUES
(uuid_generate_v4(), 'Professional Businesswoman', 'avatar_001', 'female', '25-35', 'mixed', 'professional', false, true),
(uuid_generate_v4(), 'Confident Businessman', 'avatar_002', 'male', '30-40', 'mixed', 'professional', false, true),
(uuid_generate_v4(), 'Friendly Consultant', 'avatar_003', 'female', '28-38', 'mixed', 'casual', false, true),
(uuid_generate_v4(), 'Expert Coach', 'avatar_004', 'male', '35-45', 'mixed', 'authoritative', false, true),
(uuid_generate_v4(), 'Warm Therapist', 'avatar_005', 'female', '30-40', 'mixed', 'caring', false, true),
(uuid_generate_v4(), 'Tech Expert', 'avatar_006', 'male', '25-35', 'mixed', 'modern', false, true),
(uuid_generate_v4(), 'Marketing Specialist', 'avatar_007', 'female', '28-38', 'mixed', 'creative', false, true),
(uuid_generate_v4(), 'Sales Professional', 'avatar_008', 'male', '30-45', 'mixed', 'persuasive', false, true);

-- Insert sample analytics data (for testing)
-- This would typically be generated by user interactions
INSERT INTO analytics (funnel_id, event_type, event_data, session_id, user_agent, ip_address) 
SELECT 
    f.id,
    'page_view',
    '{"page": "intro", "timestamp": "2024-01-15T10:00:00Z"}',
    'session_' || generate_random_uuid(),
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    '192.168.1.100'::inet
FROM funnels f
WHERE f.is_published = true
LIMIT 100;

-- Insert sample funnel data (for testing)
-- This would be created by users, but we'll add some sample data
INSERT INTO funnels (user_id, name, description, configuration, is_published, domain)
SELECT 
    u.id,
    'Sample Dating Funnel',
    'A sample dating funnel for testing',
    '{
        "steps": [
            {
                "id": "intro",
                "type": "video",
                "title": "Welcome",
                "question": "Welcome to our dating platform"
            }
        ]
    }',
    true,
    'sample-funnel-' || generate_random_uuid()
FROM users u
WHERE u.subscription = 'pro'
LIMIT 5;

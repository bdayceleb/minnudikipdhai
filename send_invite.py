import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ==========================================
# CONFIGURATION
# ==========================================
SENDER_EMAIL = "deepaksingh4.iitr@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "qbuk jgjj bpcz zczw"  # Replace with your Gmail App Password
RECEIVER_EMAIL = "s.deepak2527@gmail.com" # Replace with Minni's email

SUBJECT = "✨ Your Personal Study Sanctuary is Ready!! ✨"

# ==========================================
# AESTHETIC HTML EMAIL TEMPLATE
# ==========================================
HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #fdf8f5;
            margin: 0;
            padding: 40px 20px;
            color: #4a4a4a;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(220, 156, 156, 0.1);
            overflow: hidden;
            border: 1px solid #f9ecec;
        }
        .header {
            background: url('https://images.unsplash.com/photo-1518621736915-f480fe372d80?q=80&w=800&auto=format&fit=crop') center/cover;
            position: relative;
            padding: 70px 30px;
            text-align: center;
        }
        .header::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.8));
        }
        .header h1 {
            position: relative;
            color: #b85c6b;
            margin: 0;
            font-size: 38px;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 600;
            font-style: italic;
            letter-spacing: 1px;
        }
        .content {
            padding: 50px 40px;
            text-align: center;
        }
        .greeting {
            font-size: 26px;
            font-family: 'Cormorant Garamond', serif;
            color: #b85c6b;
            margin-bottom: 24px;
            font-style: italic;
        }
        .intro {
            font-size: 15px;
            line-height: 1.9;
            color: #666666;
            margin-bottom: 40px;
            font-weight: 300;
        }
        .feature-box {
            background-color: #fffaf9;
            border-radius: 12px;
            padding: 35px 30px;
            margin-bottom: 40px;
            border: 1px solid #fce8e6;
            text-align: left;
        }
        .feature {
            display: flex;
            align-items: flex-start;
            margin-bottom: 28px;
        }
        .feature:last-child {
            margin-bottom: 0;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 20px;
            line-height: 1;
        }
        .feature-text h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
            color: #b85c6b;
            font-family: 'Cormorant Garamond', serif;
            letter-spacing: 0.5px;
        }
        .feature-text p {
            margin: 0;
            font-size: 14px;
            line-height: 1.7;
            color: #777777;
            font-weight: 300;
        }
        .credentials-box {
            background-color: #fffaf9;
            border: 1px dashed #eec9cc;
            border-radius: 8px;
            padding: 25px;
            margin: 40px 0;
            text-align: center;
        }
        .credentials-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px;
            color: #b85c6b;
            font-style: italic;
            margin-bottom: 15px;
        }
        .cred-row {
            margin: 8px 0;
            font-size: 16px;
        }
        .cred-label {
            color: #888888;
            margin-right: 10px;
        }
        .cred-value {
            color: #4a4a4a;
            font-weight: 600;
            letter-spacing: 0.5px;
            background: #fff;
            padding: 4px 10px;
            border-radius: 4px;
            border: 1px solid #f9ecec;
        }
        .cta-container {
            margin-top: 30px;
            margin-bottom: 40px;
        }
        .cta-button {
            display: inline-block;
            background-color: #b85c6b;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 400;
            font-size: 15px;
            letter-spacing: 2px;
            padding: 16px 45px;
            border-radius: 4px;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }
        .cta-button:hover {
            background-color: #a04957;
            box-shadow: 0 8px 20px rgba(184, 92, 107, 0.2);
        }
        .footer {
            margin-top: 20px;
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            color: #b85c6b;
            font-style: italic;
            line-height: 1.6;
        }
        .signature {
            margin-top: 20px;
            font-size: 16px;
            color: #888888;
            font-family: 'Montserrat', sans-serif;
            font-style: normal;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Our Personal Study Sanctuary</h1>
        </div>
        
        <div class="content">
            <div class="greeting">My sweetest Minni,</div>
            
            <div class="intro">
                I wanted to create something beautiful, just for us. A quiet, safe space where it's only you, your sweetest dreams, and my endless support. I built this little world so you can focus, grow, and become everything I know you're meant to be.<br><br>
                Take my hand, step inside, and let's make our dreams come true together.
            </div>
            
            <div class="feature-box">
                <div class="feature">
                    <div class="feature-icon">🌿</div>
                    <div class="feature-text">
                        <h3>A Peaceful Space</h3>
                        <p>No distractions, no outside noise. Just a calm, gentle environment designed completely around your peace of mind.</p>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💞</div>
                    <div class="feature-text">
                        <h3>Connected Hearts</h3>
                        <p>Every moment you study, I am right there with you. Your progress lights up my day, and my rest comes only when you've reached your goals.</p>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">✨</div>
                    <div class="feature-text">
                        <h3>Everything Organized</h3>
                        <p>All your notes and memories, kept perfectly safe in one beautiful place. You just focus on what matters; I will handle the rest.</p>
                    </div>
                </div>
            </div>

            <div class="credentials-box">
                <div class="credentials-title">The Keys to Your Sanctuary</div>
                <div class="cred-row">
                    <span class="cred-label">Username:</span>
                    <span class="cred-value">vedika2904</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Password:</span>
                    <span class="cred-value">Myname@2904</span>
                </div>
            </div>
            
            <div class="cta-container">
                <a href="https://minnudikipdhai.netlify.app/api/track/click?source=aesthetic_invite_1&url=/login" class="cta-button">Step Inside</a>
            </div>
            
            <div class="footer">
                I believe in you so much.<br>
                I love you, unconditionally.
                <div class="signature">— Your Headache</div>
            </div>
        </div>
        <!-- Secret Tracking Pixel -->
        <img src="https://minnudikipdhai.netlify.app/api/track/open?source=aesthetic_invite_1" width="1" height="1" style="display:none; visibility:hidden;" alt="" />
    </div>
</body>
</html>
"""

def send_email():
    print("Preparing to send aesthetic invite to Minni...")
    
    # Create the email message container
    msg = MIMEMultipart('alternative')
    msg['Subject'] = SUBJECT
    msg['From'] = f"Your Headache <{SENDER_EMAIL}>"
    msg['To'] = RECEIVER_EMAIL

    # Attach HTML content
    part = MIMEText(HTML_CONTENT, 'html')
    msg.attach(part)

    try:
        # Connect to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        # Login
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        # Send email
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        
        print("✅ Email sent successfully! Minni is going to love it.")
    except Exception as e:
        print("❌ Failed to send email.")
        print("Error details:", e)
        print("\\nNote: If using Gmail, make sure you have 'App Passwords' enabled in your Google Account security settings!")

if __name__ == "__main__":
    send_email()

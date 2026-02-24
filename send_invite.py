import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ==========================================
# CONFIGURATION
# ==========================================
SENDER_EMAIL = "deepaksingh4.iitr@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "qbuk jgjj bpcz zczw"  # Replace with your Gmail App Password
RECEIVER_EMAIL = "s.deepak2527@gmail.com" # Replace with Minni's email

SUBJECT = "✨ Your Personal Study Sanctuary is Ready! ✨"

# ==========================================
# AESTHETIC HTML EMAIL TEMPLATE
# ==========================================
HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 40px 20px;
            color: #334155;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            overflow: hidden;
            border: 1px solid #f1f5f9;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
        }
        .intro {
            font-size: 16px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 30px;
        }
        .feature-box {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        .feature {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .feature:last-child {
            margin-bottom: 0;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 15px;
            line-height: 1;
        }
        .feature-text h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
        }
        .feature-text p {
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
            color: #64748b;
        }
        .cta-container {
            text-align: center;
            margin-top: 35px;
            margin-bottom: 20px;
        }
        .cta-button {
            display: inline-block;
            background-color: #10b981;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            padding: 16px 32px;
            border-radius: 50px;
            box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
            transition: all 0.2s ease;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
            padding-top: 30px;
            border-top: 1px solid #f1f5f9;
        }
        .love {
            color: #ef4444;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Minnuuu Ki Pdhai 📚</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hi Minni,</div>
            
            <div class="intro">
                I built something special just for us. It's time to level up our study game and achieve everything we've talked about. No more distractions, just pure focus.
            </div>
            
            <div class="feature-box">
                <div class="feature">
                    <div class="feature-icon">🚫</div>
                    <div class="feature-text">
                        <h3>No Timepass, Nothing</h3>
                        <p>A completely distraction-free zone. When you're here, you're locked in.</p>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-text">
                        <h3>📈 Better Tracking of Studies</h3>
                        <p>Watch your progress grow daily with live telemetry and beautifully designed charts.</p>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-text">
                        <h3>🗂 All Notes in One Place</h3>
                        <p>No hassle of losing notes ever again. Everything is organized, searchable, and safe.</p>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-text">
                        <h3>💾 Progress Restored</h3>
                        <p>The system remembers exactly where you left off. Just log in and resume.</p>
                    </div>
                </div>
            </div>
            
            <div class="cta-container">
                <a href="minnudikipdhai.netlify.app" class="cta-button">Enter The Sanctuary</a>
            </div>
            
            <div class="footer">
                Let's crush those goals together.<br><br>
                I love you. <span class="love">❤</span><br><br>
                — Deepak
            </div>
        </div>
    </div>
</body>
</html>
"""

def send_email():
    print("Preparing to send aesthetic invite to Minni...")
    
    # Create the email message container
    msg = MIMEMultipart('alternative')
    msg['Subject'] = SUBJECT
    msg['From'] = f"Deepak <{SENDER_EMAIL}>"
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
        print("\nNote: If using Gmail, make sure you have 'App Passwords' enabled in your Google Account security settings!")

if __name__ == "__main__":
    send_email()

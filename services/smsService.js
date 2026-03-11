const twilio = require('twilio');

class SMSService {
  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    // Check if Twilio credentials are properly configured
    if (accountSid && authToken && 
        accountSid !== 'your-account-sid' && 
        authToken !== 'your-auth-token' &&
        accountSid.startsWith('AC')) {
      
      try {
        this.client = twilio(accountSid, authToken);
        this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
        this.enabled = true;
        console.log('✅ SMS Service enabled (Twilio)');
      } catch (error) {
        this.enabled = false;
        console.warn('⚠️ SMS Service disabled (Twilio init failed)');
      }
    } else {
      this.enabled = false;
      console.warn('⚠️ SMS Service disabled (no valid Twilio credentials)');
    }
  }

  async sendSMS(to, message) {
    if (!this.enabled) {
      console.log('📱 SMS disabled, would have sent:', message.substring(0, 50) + '...');
      return { success: false, reason: 'SMS service not configured' };
    }

    if (!to) {
      console.log('⚠️ No phone number provided');
      return { success: false, reason: 'No phone number' };
    }

    try {
      const formattedNumber = to.startsWith('+') ? to : `+${to}`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedNumber
      });

      console.log('✅ SMS sent:', result.sid);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ SMS failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendAppointmentCreatedToCustomer(appointment) {
    const { customer, service, appointmentDate, startTime } = appointment;

    const message = `🔔 Appointment Booked!\n\nService: ${service.name}\nDate: ${new Date(appointmentDate).toLocaleDateString()}\nTime: ${startTime}\n\nWaiting for staff confirmation.`;

    return await this.sendSMS(customer.phone, message);
  }

  async sendAppointmentConfirmedToCustomer(appointment) {
    const { customer, staff, service, appointmentDate, startTime } = appointment;

    const message = `✅ Confirmed!\n\nService: ${service.name}\nStaff: ${staff.name}\nDate: ${new Date(appointmentDate).toLocaleDateString()}\nTime: ${startTime}\n\nSee you soon!`;

    return await this.sendSMS(customer.phone, message);
  }

  async sendAppointmentCancelled(appointment, recipient) {
    const { service, appointmentDate, startTime } = appointment;

    const message = `❌ Cancelled\n\nService: ${service.name}\nDate: ${new Date(appointmentDate).toLocaleDateString()}\nTime: ${startTime}`;

    return await this.sendSMS(recipient.phone, message);
  }

  async sendAppointmentReminder(appointment) {
    const { customer, service, appointmentDate, startTime } = appointment;

    const message = `⏰ Reminder: Your appointment is tomorrow!\n\nService: ${service.name}\nDate: ${new Date(appointmentDate).toLocaleDateString()}\nTime: ${startTime}\n\nSee you soon!`;

    return await this.sendSMS(customer.phone, message);
  }

  async sendPaymentConfirmation(appointment) {
    const { customer, amount, service } = appointment;

    const message = `💳 Payment Received!\n\nAmount: $${amount}\nService: ${service.name}\n\nThank you!`;

    return await this.sendSMS(customer.phone, message);
  }
}

module.exports = new SMSService();
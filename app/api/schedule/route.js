import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

function calculatePickupTime(selectedTime) {
  const [hours, minutes] = selectedTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes - 15;
  const pickupHours = Math.floor(totalMinutes / 60);
  const pickupMinutes = totalMinutes % 60;
  return `${String(pickupHours).padStart(2, '0')}:${String(pickupMinutes).padStart(2, '0')}`;
}

export async function POST(request) {
  try {
    const { selectedDay, selectedTime } = await request.json();

    if (!selectedTime || !selectedDay) {
      return Response.json({ error: 'selectedDay and selectedTime are required' }, { status: 400 });
    }

    await connectDB();

    const pickupTime = calculatePickupTime(selectedTime);

    const appointment = await Appointment.create({
      selectedDay,
      selectedTime,
      pickupTime,
    });

    return Response.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error('Error saving appointment:', error);
    return Response.json({ error: 'Failed to save appointment' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.ADMIN_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const appointments = await Appointment.find({}).sort({ createdAt: -1 });

    return Response.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return Response.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

<template>
  <div class="bg-white p-6 rounded-2xl border border-[#e7e7e9] w-full">
    <div class="flex justify-between items-center mb-8">
      <div class="flex flex-col gap-0.5">
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Doctors' Schedule</h2>
      </div>
      <button class="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-all active:scale-95">
        <ZenSvgIcon icon="local-common/more" :size="20" />
      </button>
    </div>

    <div class="max-h-[480px] overflow-y-auto custom-scrollbar">
      <div class="flex flex-col">
        <div 
          v-for="doctor in dashboardDoctors" 
          :key="doctor.id" 
          class="flex items-center gap-4 group cursor-pointer py-4 first:pt-0 last:pb-0 border-b-3 border-slate-100 last:border-0"
        >
          <div class="relative">
            <img :src="doctor.avatar" :alt="doctor.name" 
              class="w-15 h-15 rounded-full object-cover border border-slate-100 transition-transform"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-sm text-slate-800 truncate group-hover:text-[#243956] transition-colors">{{ doctor.name }}</h3>
            <p class="text-xs text-slate-400 truncate mt-0.5 tracking-wide">{{ doctor.specialty }}</p>
          </div>

          <div class="flex flex-col items-end gap-1">
            <span 
              class="px-2 py-0.5 rounded-full  border whitespace-nowrap"
              :class="[
                doctor.status === 'Available' 
                  ? 'bg-[#dff9f9] text-[] border-[#a2f2ef] text-xs' 
                  : 'bg-rose-50 text-rose-500 border-[#fc4245] text-sm'
              ]"
            >
              {{ doctor.status }}
            </span>
            
            <span v-if="doctor.status === 'Available'" class="text-xs text-slate-400">
              {{ doctor.timeRange }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ZenSvgIcon from '@/components/core/base/zen-svg-icon/index.vue';

defineOptions({ name: 'DoctorSchedule' });

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  status: 'Available' | 'Unavailable';
  timeRange?: string;
}

const dashboardDoctors = ref<Doctor[]>([
  {
    id: 1,
    name: 'Dr. Petra Winsburry',
    specialty: 'General Medicine',
    avatar: 'https://i.pravatar.cc/150?u=Petra',
    status: 'Available',
    timeRange: '09:00 AM - 12:00 PM'
  },
  {
    id: 2,
    name: 'Dr. Ameena Karim',
    specialty: 'Orthopedics',
    avatar: 'https://i.pravatar.cc/150?u=Ameena',
    status: 'Unavailable'
  },
  {
    id: 3,
    name: 'Dr. Olivia Martinez',
    specialty: 'Cardiology',
    avatar: 'https://i.pravatar.cc/150?u=Olivia',
    status: 'Available',
    timeRange: '10:00 AM - 01:00 PM'
  },
  {
    id: 4,
    name: 'Dr. Damian Sanchez',
    specialty: 'Pediatrics',
    avatar: 'https://i.pravatar.cc/150?u=Damian',
    status: 'Available',
    timeRange: '11:00 AM - 02:00 PM'
  },
  {
    id: 5,
    name: 'Dr. Chloe Harrington',
    specialty: 'Dermatology',
    avatar: 'https://i.pravatar.cc/150?u=Chloe',
    status: 'Unavailable'
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    avatar: 'https://i.pravatar.cc/150?u=James',
    status: 'Available',
    timeRange: '02:00 PM - 05:00 PM'
  },
  {
    id: 7,
    name: 'Dr. Sophia Chen',
    specialty: 'Psychiatry',
    avatar: 'https://i.pravatar.cc/150?u=Sophia',
    status: 'Available',
    timeRange: '08:00 AM - 11:00 AM'
  },
  {
    id: 8,
    name: 'Dr. Marcus Thorne',
    specialty: 'Oncology',
    avatar: 'https://i.pravatar.cc/150?u=Marcus',
    status: 'Unavailable'
  },
  {
    id: 9,
    name: 'Dr. Elena Rossi',
    specialty: 'Endocrinology',
    avatar: 'https://i.pravatar.cc/150?u=Elena',
    status: 'Available',
    timeRange: '01:00 PM - 04:00 PM'
  },
  {
    id: 10,
    name: 'Dr. Victor Hugo',
    specialty: 'Gastroenterology',
    avatar: 'https://i.pravatar.cc/150?u=Victor',
    status: 'Available',
    timeRange: '03:00 PM - 06:00 PM'
  },
]);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
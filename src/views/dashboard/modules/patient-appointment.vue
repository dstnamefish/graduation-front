<template>
  <div class="p-7 rounded-2xl border border-border w-full bg-surface">
    <div class="flex justify-between items-center mb-8 px-1">
      <h2 class="text-2xl font-bold text-title tracking-tight">patient appointments</h2>
      <button class="text-action-text hover:text-action-text-hover transition-colors">View All</button>
    </div>

    <!-- 日期 -->
    <div class="flex items-center justify-between bg-accent rounded-2xl p-2 mb-10">
      <button
        @click="scrollDates('left')"
        class="w-10 h-10 flex items-center justify-center group"
      >
        <WnSvgIcon
          icon="hugeicons:arrow-left-01"
          :size="24"
        />
      </button>
      <div
        ref="dateScrollContainer"
        class="flex-1 flex items-center px-4 overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="flex items-center shrink-0"
        >
          <div
            @click="selectDate(day)"
            class="flex flex-col items-center justify-center min-w-[86px] h-14 rounded-lg cursor-pointer transition-all duration-300"
            :class="day.isActive ? 'bg-primary text-primary-foreground' : 'text-placeholder hover:bg-surface'"
          >
            <span class="text-xs opacity-60 mb-1 transition-colors">
              {{ day.weekDay }}
            </span>
            <span class="text-xl text leading-none">{{ day.date }}</span>
          </div>
          <div
            v-if="idx < calendarDays.length - 1"
            class="w-0.5 h-12 bg-border mx-2 shrink-0"
          ></div>
        </div>
      </div>
      <button
        @click="scrollDates('right')"
        class="w-10 h-10 flex items-center justify-center group"
      >
        <WnSvgIcon
          icon="hugeicons:arrow-right-01"
          :size="24"
        />
      </button>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto custom-scrollbar -mx-2 px-2">
      <table class="w-full border-separate border-spacing-0">
        <thead>
          <tr class="text-left">
            <th
              v-for="col in tableColumns"
              :key="col.key"
              @click="toggleSort(col.key)"
              class="pb-6 text-sm px-4 text-muted cursor-pointer font-normal select-none group/th"
            >
              <div class="flex items-center gap-1.5 transition-colors">
                {{ col.name }}
                <div
                  class="flex flex-col -gap-1 transition-opacity"
                  :class="
                    sortConfig.key === col.key
                      ? 'opacity-100'
                      : 'opacity-20 group-hover/th:opacity-60'
                  "
                >
                  <WnSvgIcon
                    icon="hugeicons:arrow-up-01"
                    :size="16"
                    :class="
                      sortConfig.key === col.key && sortConfig.order === 'asc'
                        ? 'text-link'
                        : ''
                    "
                  />
                  <WnSvgIcon
                    icon="hugeicons:arrow-down-01"
                    :size="16"
                    :class="
                      sortConfig.key === col.key && sortConfig.order === 'desc'
                        ? 'text-link'
                        : ''
                    "
                    class="-mt-2.5"
                  />
                </div>
              </div>
            </th>
            <th class="pb-6"></th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            v-for="(apt, index) in sortedAppointments"
            :key="apt.id"
            class="group hover:bg-slate-50/50 transition-colors"
          >
            <td
              v-for="col in tableColumns"
              :key="col.key"
              class="py-5 px-4 block sm:table-cell"
              :class="[
                index !== sortedAppointments.length - 1 ? 'border-b border-border' : '',
              ]"
            >
              <span
                v-if="col.key === 'status'"
                class="px-4 py-1.5 rounded-xl inline-block"
                :class="STATUS_STYLES[apt.status]"
              >
                {{ apt.status }}
              </span>
              <template v-else>{{ apt[col.key as keyof typeof apt] }}</template>
            </td>
            <td
              class="py-5 px-4 text-right block sm:table-cell"
              :class="index !== sortedAppointments.length - 1 ? 'border-b border-border' : ''"
            >
              <button class="text-placeholder hover:text-title p-2">
                <WnSvgIcon
                  icon="hugeicons:more-horizontal"
                  :size="24"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderBy } from 'lodash-es';

defineOptions({ name: 'PatientAppointment' });

const tableColumns = [
  { name: 'Name', key: 'patientName' },
  { name: 'Date', key: 'date' },
  { name: 'Time', key: 'time' },
  { name: 'Doctor', key: 'doctor' },
  { name: 'Treatment', key: 'treatment' },
  { name: 'Status', key: 'status' },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmed: 'bg-appointment-confirmed-bg text-appointment-confirmed-text border-appointment-confirmed-border',
  Pending: 'bg-appointment-pending-bg text-appointment-pending-text border-appointment-pending-border',
  Cancelled: 'bg-appointment-cancelled-bg text-appointment-cancelled-text border-appointment-cancelled-border',
};

const dateScrollContainer = ref<HTMLElement | null>(null);
const sortConfig = ref({ key: 'patientName', order: 'asc' });

const calendarDays = ref(
  [
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
    'Mon',
    'Tue',
  ].map((w, i) => ({ weekDay: w, date: 12 + i, isActive: i === 8 })),
);
const patientAppointments = ref([
  {
    id: 1,
    patientName: 'caren g. simpson',
    date: '20-07-28',
    time: '09:00 am',
    doctor: 'dr. petra winsburry',
    treatment: 'routine check-up',
    status: 'Confirmed',
  },
  {
    id: 2,
    patientName: 'edgar warrow',
    date: '20-07-28',
    time: '10:30 am',
    doctor: 'dr. olivia martinez',
    treatment: 'cardiac consultation',
    status: 'Confirmed',
  },
  {
    id: 3,
    patientName: 'ocean jane lupre',
    date: '20-07-28',
    time: '11:00 am',
    doctor: 'dr. damian sanchez',
    treatment: 'pediatric check-up',
    status: 'Pending',
  },
  {
    id: 4,
    patientName: 'shane riddick',
    date: '20-07-28',
    time: '01:00 pm',
    doctor: 'dr. chloe harrington',
    treatment: 'skin allergy',
    status: 'Cancelled',
  },
  {
    id: 5,
    patientName: 'queen lawnston',
    date: '20-07-28',
    time: '02:30 pm',
    doctor: 'dr. petra winsburry',
    treatment: 'follow-up visit',
    status: 'Confirmed',
  },
]);

const sortedAppointments = computed(() =>
  sortConfig.value.key
    ? orderBy(
        patientAppointments.value,
        [sortConfig.value.key],
        [sortConfig.value.order as 'asc' | 'desc'],
      )
    : patientAppointments.value,
);
const toggleSort = (key: string) =>
  (sortConfig.value = {
    key,
    order: sortConfig.value.key === key && sortConfig.value.order === 'asc' ? 'desc' : 'asc',
  });
const selectDate = (day: any) => {
  calendarDays.value.forEach((d) => (d.isActive = false));
  day.isActive = true;
};
const scrollDates = (dir: 'left' | 'right') =>
  dateScrollContainer.value?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
</script>

<template>
  <div class="departments-page">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-secondary">Departments</h1>
      <div class="flex items-center gap-3">
        <ElInput
          v-model="searchQuery"
          placeholder="Search departments..."
          prefix-icon="Search"
          class="w-64"
          clearable
          @input="handleSearch"
        />
        <ElButton type="primary" @click="handleAddDepartment">
          <WnSvgIcon icon="solar:add-circle-bold" :size="16" class="mr-1" />
          Add Department
        </ElButton>
      </div>
    </div>

    <!-- Department Grid -->
    <ElScrollbar class="flex-1">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div class="h-40 bg-gray-200" />
          <div class="p-5">
            <div class="h-5 bg-gray-200 rounded w-1/2 mb-3" />
            <div class="h-3 bg-gray-200 rounded w-full mb-2" />
            <div class="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        <div
          v-for="dept in filteredDepartments"
          :key="dept.id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm border border-default-border hover:shadow-lg transition-all duration-300 group"
        >
          <!-- Image -->
          <div class="h-40 overflow-hidden relative">
            <img
              :src="dept.image"
              :alt="dept.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-secondary mb-2">{{ dept.name }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {{ dept.description }}
            </p>

            <!-- Team Avatars & See Detail -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <!-- Avatar Stack -->
                <div class="flex -space-x-2">
                  <div
                    v-for="(avatar, idx) in dept.teamAvatars.slice(0, 4)"
                    :key="idx"
                    class="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
                  >
                    <img :src="avatar" class="w-full h-full object-cover" />
                  </div>
                </div>
                <span v-if="dept.teamCount > 4" class="text-xs text-gray-400 ml-2">
                  +{{ dept.teamCount - 4 }} others
                </span>
              </div>

              <ElButton
                type="primary"
                size="small"
                class="rounded-lg"
                @click="handleViewDetail(dept)"
              >
                See Detail
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { departmentService } from '@/api/services';

defineOptions({ name: 'Departments' });

// State
const loading = ref(false);
const searchQuery = ref('');

interface Department {
  id: number;
  name: string;
  description: string;
  image: string;
  teamAvatars: string[];
  teamCount: number;
}

const departments = ref<Department[]>([]);

// Computed
const filteredDepartments = computed(() => {
  if (!searchQuery.value) {return departments.value;}
  const query = searchQuery.value.toLowerCase();
  return departments.value.filter(
    (d) => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)
  );
});

// Methods
const fetchDepartments = async () => {
  loading.value = true;
  try {
    const res = await departmentService.fetchDepartments();
    departments.value = (res.list || res || []).map((d: any, index: number) => ({
      id: d.id || index + 1,
      name: d.name,
      description: d.description || getDefaultDescription(d.name),
      image: d.image || getDepartmentImage(d.name),
      teamAvatars: generateTeamAvatars(d.name, d.doctorCount || 5),
      teamCount: d.doctorCount || Math.floor(Math.random() * 15) + 5,
    }));
  } catch {
    // Use mock data
    departments.value = getMockDepartments();
  } finally {
    loading.value = false;
  }
};

const getDefaultDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    'General Medicine': 'Provides comprehensive healthcare services including routine check-ups, preventive care, and treatment for a wide range of conditions.',
    'Cardiology': 'Specializes in the diagnosis and treatment of heart-related conditions, offering advanced cardiac care and preventive services.',
    'Pediatrics': 'Dedicated to the health and well-being of children, providing specialized care for infants, children, and adolescents.',
    'Dermatology': 'Focuses on the treatment of skin conditions, offering medical and cosmetic dermatology services to improve skin health.',
    'Internal Medicine': 'Provides primary care for adults, focusing on the prevention, diagnosis, and treatment of adult diseases.',
    'Orthopedics': 'Specializes in the treatment of musculoskeletal system disorders, including bones, joints, ligaments, tendons, and muscles.',
    'Neurology': 'Deals with disorders of the nervous system, offering expert care for conditions affecting the brain, spinal cord, and nerves.',
    'Oncology': 'Focuses on the diagnosis and treatment of cancer, providing comprehensive cancer care and support services.',
    'Obstetrics and Gynecology (OB/GYN)': 'Provides care for women\'s health, including pregnancy, childbirth, and reproductive health.',
  };
  return descriptions[name] || 'Provides specialized medical care and treatment services.';
};

const getDepartmentImage = (name: string): string => {
  const images: Record<string, string> = {
    'General Medicine': 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=300&fit=crop',
    'Cardiology': 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=300&fit=crop',
    'Pediatrics': 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop',
    'Dermatology': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
    'Internal Medicine': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
    'Orthopedics': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    'Neurology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'Oncology': 'https://images.unsplash.com/photo-1631815589654-fec8d7afc0b6?w=400&h=300&fit=crop',
    'Obstetrics and Gynecology (OB/GYN)': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop',
  };
  return images[name] || 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop';
};

const generateTeamAvatars = (seed: string, count: number): string[] => {
  const avatars: string[] = [];
  for (let i = 0; i < Math.min(count, 6); i++) {
    avatars.push(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}-${i}`);
  }
  return avatars;
};

const handleSearch = () => {
  // Filtering is done via computed property
};

const handleAddDepartment = () => {
  ElMessage.info('Add Department dialog would open here');
};

const handleViewDetail = (dept: Department) => {
  ElMessage.info(`Viewing ${dept.name} department details`);
};

// Mock data
const getMockDepartments = (): Department[] => [
  {
    id: 1,
    name: 'General Medicine',
    description: 'Provides comprehensive healthcare services including routine check-ups, preventive care, and treatment for a wide range of conditions.',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('general', 6),
    teamCount: 12,
  },
  {
    id: 2,
    name: 'Cardiology',
    description: 'Specializes in the diagnosis and treatment of heart-related conditions, offering advanced cardiac care and preventive services.',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('cardio', 5),
    teamCount: 20,
  },
  {
    id: 3,
    name: 'Pediatrics',
    description: 'Dedicated to the health and well-being of children, providing specialized care for infants, children, and adolescents.',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('pedia', 4),
    teamCount: 7,
  },
  {
    id: 4,
    name: 'Dermatology',
    description: 'Focuses on the treatment of skin conditions, offering medical and cosmetic dermatology services to improve skin health.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('derma', 3),
    teamCount: 5,
  },
  {
    id: 5,
    name: 'Internal Medicine',
    description: 'Provides primary care for adults, focusing on the prevention, diagnosis, and treatment of adult diseases.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('internal', 5),
    teamCount: 12,
  },
  {
    id: 6,
    name: 'Orthopedics',
    description: 'Specializes in the treatment of musculoskeletal system disorders, including bones, joints, ligaments, tendons, and muscles.',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('ortho', 4),
    teamCount: 9,
  },
  {
    id: 7,
    name: 'Neurology',
    description: 'Deals with disorders of the nervous system, offering expert care for conditions affecting the brain, spinal cord, and nerves.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('neuro', 4),
    teamCount: 8,
  },
  {
    id: 8,
    name: 'Oncology',
    description: 'Focuses on the diagnosis and treatment of cancer, providing comprehensive cancer care and support services.',
    image: 'https://images.unsplash.com/photo-1631815589654-fec8d7afc0b6?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('onco', 3),
    teamCount: 6,
  },
  {
    id: 9,
    name: 'Obstetrics and Gynecology (OB/GYN)',
    description: 'Provides care for women\'s health, including pregnancy, childbirth, and reproductive health.',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop',
    teamAvatars: generateTeamAvatars('obgyn', 5),
    teamCount: 11,
  },
];

// Lifecycle
onMounted(() => {
  fetchDepartments();
});
</script>

<style scoped>
.departments-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
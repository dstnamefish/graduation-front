/**
 * 科室相关的业务工具函数
 */

/**
 * 获取科室默认描述
 */
export const getDefaultDepartmentDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    'General Medicine':
      'Provides comprehensive healthcare services including routine check-ups, preventive care, and treatment for a wide range of conditions.',
    'Cardiology':
      'Specializes in the diagnosis and treatment of heart-related conditions, offering advanced cardiac care and preventive services.',
    'Pediatrics':
      'Dedicated to the health and well-being of children, providing specialized care for infants, children, and adolescents.',
    'Dermatology':
      'Focuses on the treatment of skin conditions, offering medical and cosmetic dermatology services to improve skin health.',
    'Internal Medicine':
      'Provides primary care for adults, focusing on the prevention, diagnosis, and treatment of adult diseases.',
    'Orthopedics':
      'Specializes in the treatment of musculoskeletal system disorders, including bones, joints, ligaments, tendons, and muscles.',
    'Neurology':
      'Deals with disorders of the nervous system, offering expert care for conditions affecting the brain, spinal cord, and nerves.',
    'Oncology':
      'Focuses on the diagnosis and treatment of cancer, providing comprehensive cancer care and support services.',
    'Obstetrics and Gynecology (OB/GYN)':
      "Provides care for women's health, including pregnancy, childbirth, and reproductive health.",
  };
  return descriptions[name] || 'Provides specialized medical care and treatment services.';
};

/**
 * 获取科室默认图片
 */
export const getDepartmentImageUrl = (name: string): string => {
  const images: Record<string, string> = {
    'General Medicine':
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=300&fit=crop',
    'Cardiology':
      'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=300&fit=crop',
    'Pediatrics':
      'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop',
    'Dermatology':
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
    'Internal Medicine':
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
    'Orthopedics': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    'Neurology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'Oncology': 'https://images.unsplash.com/photo-1631815589654-fec8d7afc0b6?w=400&h=300&fit=crop',
    'Obstetrics and Gynecology (OB/GYN)':
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop',
  };
  return (
    images[name] ||
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop'
  );
};

/**
 * 生成团队头像
 */
export const generateTeamAvatars = (seed: string, count: number): string[] => {
  const avatars: string[] = [];
  for (let i = 0; i < Math.min(count, 6); i++) {
    avatars.push(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}-${i}`);
  }
  return avatars;
};

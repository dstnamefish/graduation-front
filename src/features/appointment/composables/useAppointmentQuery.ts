import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { appointmentService } from '../api';
import { AppointmentStatus } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';

// -------------------------------------------------------------
// 🚀 最佳实践：服务端状态与业务逻辑提取 (Headless / Composables)
// -------------------------------------------------------------
// 这里把关于 "预约" 这个领域的所有接口交互和状态缓存管理全部剥离开来。
// UI 层 (index.vue) 只需要调用这个文件导出的钩子即可，不再包含任何 axios 和 loading 相关的状态。

export function useAppointmentStats() {
  return useQuery({
    queryKey: ['appointment', 'stats'],
    queryFn: async () => {
      const counts = await appointmentService.countByStatus();
      return {
        all: counts.reduce((acc, curr) => acc + curr.count, 0),
        confirmed: counts.find((c) => Number(c.status) === AppointmentStatus.CONFIRMED)?.count || 0,
        pending: counts.find((c) => Number(c.status) === AppointmentStatus.PENDING)?.count || 0,
        cancelled: counts.find((c) => Number(c.status) === AppointmentStatus.CANCELLED)?.count || 0,
      };
    },
    // 全局数据，可设置后台自动刷新避免过时
    staleTime: 1000 * 60 * 5,
  });
}

// 注意这里：如果是涉及到翻页和搜索的数据，用原先封装好的 useTable 依旧是可行的。
// 这里展示：如何通过 useMutation 优雅去处理那些点击操作（比如取消和完成操作）

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isBatch = false }: { id: number; isBatch?: boolean }) => {
      return appointmentService.cancel(id, {
        cancelReason: isBatch ? 'Batch cancellation' : 'User requested cancellation',
      });
    },
    onSuccess: () => {
      // 操作成功后，自动让所有缓存的 table 列表失效，触发自动重新请求，完全抛去了手动再调 search(...) 的心智负担。
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
    },
    onError: (error: any) => {
      ElMessage.error('Failed to cancel appointment: ' + (error.message || 'Unknown error'));
    },
  });
}

export function useRescheduleAppointment() {
  return () => {
    ElMessage.info('Rescheduling coming soon...');
  };
}

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createInquiry,
  type CreateInquiryRequest,
  type CreateInquiryResponse,
} from '@/api/settings/settingPostApi';


// 문의 생성 뮤테이션 훅 
export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation<CreateInquiryResponse, unknown, CreateInquiryRequest>({
    mutationFn: (body: CreateInquiryRequest) => createInquiry(body),
    onSuccess: data => {
      console.log('[useCreateInquiry] Inquiry created:', data);
      qc.invalidateQueries({queryKey: ['settings', 'inquiries']});
    },
  });
}

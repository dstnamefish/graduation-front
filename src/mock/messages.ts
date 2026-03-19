// src/mock/message.ts

export const mockConversations = [
  {
    id: 1,
    targetUserName: 'John Doe',
    targetUserRole: 'Patient',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=c0aede',
    lastMessageContent: 'I need to reschedule my appointment f...',
    lastMessageTime: '2028-07-20T09:30:00',
    unreadCount: 3,
  },
  {
    id: 2,
    targetUserName: 'Dr. Emily Smith',
    targetUserRole: 'Doctor',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf',
    lastMessageContent: "Please review the patient's blood test r...",
    lastMessageTime: '2028-07-20T10:15:00',
    unreadCount: 5,
  },
  {
    id: 3,
    targetUserName: 'Mary Johnson',
    targetUserRole: 'Patient',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mary&backgroundColor=b6e3f4',
    lastMessageContent: 'Thank you for the excellent care during...',
    lastMessageTime: '2028-07-20T10:20:00',
    unreadCount: 2,
  },
  {
    id: 4,
    targetUserName: 'Dr. Michael Brown',
    targetUserRole: 'Doctor',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede',
    lastMessageContent: "You're welcome, Dr. Brown. If you need anyt...",
    lastMessageTime: '2028-07-20T10:40:00',
    unreadCount: 0,
  },
  {
    id: 5,
    targetUserName: 'Susan Lee',
    targetUserRole: 'Patient',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susan&backgroundColor=ffdfbf',
    lastMessageContent: 'I have a few questions about my treatm...',
    lastMessageTime: '2028-07-20T13:20:00',
    unreadCount: 1,
  },
  {
    id: 6,
    targetUserName: 'Kevin White',
    targetUserRole: 'Patient',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin&backgroundColor=b6e3f4',
    lastMessageContent: 'The symptoms have worsened. Should...',
    lastMessageTime: '2028-07-20T14:10:00',
    unreadCount: 1,
  },
  {
    id: 7,
    targetUserName: 'Dr. Linda Green',
    targetUserRole: 'Doctor',
    targetUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda&backgroundColor=d1d4f9',
    lastMessageContent: 'Please update the preventive care guid...',
    lastMessageTime: '2028-07-20T14:45:00',
    unreadCount: 2,
  }
];

export const mockMessages = [
  {
    id: 101,
    conversationId: 4,
    senderId: 4, // 对方
    content: 'Can you confirm the schedule for the Geriatric Care session tomorrow afternoon?',
    sentAt: '2028-07-20T10:00:00',
    isRead: true,
  },
  {
    id: 102,
    conversationId: 4,
    senderId: 1, // 我自己 (Current User ID = 1)
    content: 'Sure, Dr. Brown. Let me check the schedule for you.',
    sentAt: '2028-07-20T10:20:00',
    isRead: true,
  },
  {
    id: 103,
    conversationId: 4,
    senderId: 1,
    content: 'The Geriatric Care session is scheduled for 2:00 PM to 4:00 PM tomorrow. You have five patients lined up.',
    sentAt: '2028-07-20T10:20:30',
    isRead: true,
  },
  {
    id: 104,
    conversationId: 4,
    senderId: 4,
    content: 'Thank you. Can you please provide me the list of patients and their conditions?',
    sentAt: '2028-07-20T10:26:00',
    isRead: true,
  },
  {
    id: 105,
    conversationId: 4,
    senderId: 1,
    content: 'Of course. The patients are:\n\n1. James Wilson - Arthritis Management\n2. Mary Johnson - Diabetes Monitoring\n3. Susan Lee - Hypertension Check-Up\n4. Robert Brown - Heart Disease Follow-Up\n5. Emily Thompson - Medication Review',
    sentAt: '2028-07-20T10:30:00',
    isRead: true,
  },
  {
    id: 106,
    conversationId: 4,
    senderId: 4,
    content: "Great, thanks for the information. I'll be prepared for the session. Also, here's the X-ray image for patient Mary Johnson:",
    sentAt: '2028-07-20T10:35:00',
    isRead: true,
    attachments: [
      {
        name: 'xray_mary_johnson.png',
        type: 'image/png',
        size: 2456789,
        url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
      }
    ],
  },
  {
    id: 108,
    conversationId: 4,
    senderId: 1,
    content: 'Got it! I\'ve also attached the patient\'s medical report and the lab results for your reference.',
    sentAt: '2028-07-20T10:38:00',
    isRead: true,
    attachments: [
      {
        name: 'medical_report_mary_johnson.pdf',
        type: 'application/pdf',
        size: 1024567,
        url: '#',
      },
      {
        name: 'lab_results_2028.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 524288,
        url: '#',
      }
    ],
  },
  {
    id: 107,
    conversationId: 4,
    senderId: 1,
    content: "You're welcome, Dr. Brown. If you need anything else, just let me know.",
    sentAt: '2028-07-20T10:40:00',
    isRead: true,
  }
];
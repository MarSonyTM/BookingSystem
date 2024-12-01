export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          website: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          service_type: 'physio' | 'massage';
          date: string;
          status: 'pending' | 'confirmed' | 'cancelled';
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          service_type: 'physio' | 'massage';
          date: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          service_type?: 'physio' | 'massage';
          date?: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
      };
    };
  };
}
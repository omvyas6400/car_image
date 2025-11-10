import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
      <h3 className="text-xl font-semibold text-white mb-4">Profile</h3>
      
      <div className="space-y-4 max-w-full overflow-hidden">
        <div>
          <label className="block text-sm font-medium text-gray-400">Email</label>
          <p className="text-white break-words">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Member Since</label>
          <p className="text-white">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <Button 
          onClick={handleSignOut}
          variant="secondary"
          className="w-full mt-4"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
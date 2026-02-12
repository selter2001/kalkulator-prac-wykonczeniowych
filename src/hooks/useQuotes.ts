import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Room } from '@/types/calculator';
import { SavedQuote } from '@/types/quote';
import { useToast } from '@/hooks/use-toast';

export const useQuotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our types
      const transformedQuotes: SavedQuote[] = (data || []).map(quote => ({
        ...quote,
        data: quote.data as unknown as Room[],
        vat_rate: Number(quote.vat_rate)
      }));
      
      setQuotes(transformedQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać wycen',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const saveQuote = useCallback(async (
    name: string,
    rooms: Room[],
    vatRate: number,
    preparedBy: string
  ): Promise<SavedQuote | null> => {
    if (!user) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany, aby zapisać wycenę',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          user_id: user.id,
          name: name.trim(),
          data: JSON.parse(JSON.stringify(rooms)),
          vat_rate: vatRate,
          prepared_by: preparedBy || null,
        }])
        .select()
        .single();

      if (error) throw error;

      const savedQuote: SavedQuote = {
        ...data,
        data: data.data as unknown as Room[],
        vat_rate: Number(data.vat_rate)
      };

      setQuotes(prev => [savedQuote, ...prev]);
      
      toast({
        title: 'Sukces',
        description: 'Wycena została zapisana w chmurze',
      });

      return savedQuote;
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać wyceny',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const updateQuote = useCallback(async (
    quoteId: string,
    name: string,
    rooms: Room[],
    vatRate: number,
    preparedBy: string
  ): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          name: name.trim(),
          data: JSON.parse(JSON.stringify(rooms)),
          vat_rate: vatRate,
          prepared_by: preparedBy || null,
        })
        .eq('id', quoteId)
        .eq('user_id', user.id);

      if (error) throw error;

      setQuotes(prev => prev.map(q => 
        q.id === quoteId 
          ? { ...q, name, data: rooms, vat_rate: vatRate, prepared_by: preparedBy, updated_at: new Date().toISOString() }
          : q
      ));

      toast({
        title: 'Sukces',
        description: 'Wycena została zaktualizowana',
      });

      return true;
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować wyceny',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const deleteQuote = useCallback(async (quoteId: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId)
        .eq('user_id', user.id);

      if (error) throw error;

      setQuotes(prev => prev.filter(q => q.id !== quoteId));

      toast({
        title: 'Sukces',
        description: 'Wycena została usunięta',
      });

      return true;
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć wyceny',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const getQuote = useCallback(async (quoteId: string): Promise<SavedQuote | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        data: data.data as unknown as Room[],
        vat_rate: Number(data.vat_rate)
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
  }, [user]);

  return {
    quotes,
    isLoading,
    fetchQuotes,
    saveQuote,
    updateQuote,
    deleteQuote,
    getQuote,
  };
};

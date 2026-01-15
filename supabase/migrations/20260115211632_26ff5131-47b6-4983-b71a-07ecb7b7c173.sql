-- Create quotes table for storing user quotes
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  vat_rate NUMERIC NOT NULL DEFAULT 23,
  prepared_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for secure user access (users can only access their own quotes)
CREATE POLICY "Users can view their own quotes" 
ON public.quotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes" 
ON public.quotes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes" 
ON public.quotes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster user queries
CREATE INDEX idx_quotes_user_id ON public.quotes(user_id);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at DESC);
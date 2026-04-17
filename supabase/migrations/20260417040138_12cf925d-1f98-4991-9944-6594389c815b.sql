CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.groups WHERE class_code = code) INTO exists_check;
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_class_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.class_code IS NULL THEN
    NEW.class_code := public.generate_class_code();
  END IF;
  RETURN NEW;
END;
$$;
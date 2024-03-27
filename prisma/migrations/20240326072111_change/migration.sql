-- This is an empty migration.
CREATE OR REPLACE FUNCTION update_payment_status()
 RETURNS TRIGGER AS $$
 BEGIN
     IF NEW.paid = NEW.value THEN
         NEW."paymentStatus" = 'PAID';
     ELSE
         NEW."paymentStatus" = 'PAID';
     END IF;
     RETURN NEW;
 END;
 $$ LANGUAGE plpgsql;


CREATE TRIGGER update_payment_status_trigger
BEFORE UPDATE ON gym."Subscription"
FOR EACH ROW
EXECUTE PROCEDURE update_payment_status();
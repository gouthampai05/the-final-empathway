import { subscriberSchema, subscriberFormSchema } from "../validations/SubscriberValidations";
import { type Subscriber, type SubscriberFormData } from "../types/Subscriber";
import { getCurrentDate } from '@/lib/getCurrentDate';

export const validateEmailUniqueness = (email: string, existingSubscribers: Subscriber[], excludeId?: string) => {
  const emailExists = existingSubscribers.some(
    s => s.email.toLowerCase() === email.toLowerCase() && s.id !== excludeId
  );
  
  if (emailExists) {
    throw new Error("A subscriber with this email already exists.");
  }
};

export const createSubscriber = async (data: SubscriberFormData, existingSubscribers: Subscriber[]): Promise<Subscriber> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const validatedData = subscriberFormSchema.parse(data);
  validateEmailUniqueness(validatedData.email, existingSubscribers);
  
  const now = getCurrentDate();
  const newSubscriber = {
    id: (existingSubscribers.length + 1).toString(),
    name: validatedData.name.trim(),
    email: validatedData.email.toLowerCase().trim(),
    subscriptionDate: now,
    status: validatedData.status,
    source: validatedData.source,
    tags: validatedData.tags,
    lastActivity: now,
    createdAt: now,
    updatedAt: now,
  };

  return subscriberSchema.parse(newSubscriber);
};

export const updateSubscriber = async (id: string, data: SubscriberFormData, existingSubscribers: Subscriber[]): Promise<Subscriber> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const validatedData = subscriberFormSchema.parse(data);
  validateEmailUniqueness(validatedData.email, existingSubscribers, id);
  
  const subscriber = existingSubscribers.find(s => s.id === id);
  if (!subscriber) {
    throw new Error('Subscriber not found');
  }
  
  const updatedSubscriber = {
    ...subscriber,
    name: validatedData.name.trim(),
    email: validatedData.email.toLowerCase().trim(),
    status: validatedData.status,
    source: validatedData.source,
    tags: validatedData.tags,
  };

  return subscriberSchema.parse(updatedSubscriber);
};

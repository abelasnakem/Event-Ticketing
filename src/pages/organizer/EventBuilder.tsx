import { ActionIcon, Button, Card, FileInput, Group, Image, NumberInput, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { IconCheck, IconPlus, IconTrash, IconTicket } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

const presetTiers = [
  { id: 'regular', label: 'Regular', price: 600, quantity: 1000 },
  { id: 'vip', label: 'VIP', price: 2200, quantity: 300 },
  { id: 'vvip', label: 'VVIP', price: 4200, quantity: 80 },
];

export default function EventBuilder() {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      venue: '',
      city: '',
      datetime: '',
    },
  });

  const [tiers, setTiers] = useState(presetTiers);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const addTier = () => {
    setTiers((prev) => [...prev, { id: `tier-${Date.now()}`, label: 'Custom', price: 0, quantity: 50 }]);
  };

  const updateTier = (index: number, field: 'label' | 'price' | 'quantity', value: string | number) => {
    setTiers((current) => {
      const draft = [...current];
      draft[index] = { ...draft[index], [field]: value };
      return draft;
    });
  };

  const removeTier = (index: number) => {
    setTiers((current) => current.filter((_, idx) => idx !== index));
  };

  const handleBannerUpload = (file: File | null) => {
    if (!file) {
      setBannerFile(null);
      setBannerPreview(null);
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = form.onSubmit((values) => {
    const payload = { ...values, tiers, banner: bannerPreview, bannerFileName: bannerFile?.name };
    console.log('Draft event payload', payload);
    notifications.show({
      title: 'Event draft saved',
      message: 'You can fine-tune ticket tiers or publish when ready.',
      color: 'teal',
      icon: <IconCheck size={18} />,
    });
    navigate('/organizer');
  });

  return (
    <form onSubmit={handleSubmit}>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Create an experience</Title>
          <Text c="dimmed">Capture the essentials, stack ticket tiers, and roll out invites.</Text>
        </div>
        <Button type="submit" radius="lg" leftSection={<IconTicket size={18} />}>
          Save draft
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
        <Card padding="xl" className="glass-panel">
          <Title order={4} mb="lg">
            Event details
          </Title>
          <Stack>
            <TextInput label="Event name" placeholder="Add a memorable title" required {...form.getInputProps('name')} />
            <Textarea label="Experience description" minRows={4} placeholder="Why should attendees care?" {...form.getInputProps('description')} />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Venue" placeholder="Friendship Park" required {...form.getInputProps('venue')} />
              <TextInput label="City" placeholder="Addis Ababa" required {...form.getInputProps('city')} />
            </SimpleGrid>
            <TextInput
              label="Date & time"
              type="datetime-local"
              required
              {...form.getInputProps('datetime')}
            />
            <FileInput
              label="Banner artwork"
              placeholder="Upload hero image"
              accept="image/*"
              value={bannerFile}
              onChange={handleBannerUpload}
              description="Landscape 3:2 works best for share cards"
            />
            {bannerPreview && (
              <Stack gap={4}>
                <Image src={bannerPreview} radius="md" alt="Event banner preview" />
                <Text size="xs" c="dimmed">
                  Banner preview
                </Text>
              </Stack>
            )}
          </Stack>
        </Card>

        <Card padding="xl" className="glass-panel">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={4}>Ticket tiers</Title>
              <Text size="sm" c="dimmed">
                Offer Regular, VIP, VVIP, or custom packs with flexible pricing.
              </Text>
            </div>
            <Button variant="light" radius="lg" onClick={addTier} leftSection={<IconPlus size={16} />}>
              Add tier
            </Button>
          </Group>

          <Stack>
            {tiers.map((tier, index) => (
              <Card key={tier.id} padding="lg" radius="lg" className="glass-panel" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Group justify="space-between" align="flex-start" mb="sm">
                  <Text fw={600}>{tier.label}</Text>
                  <ActionIcon color="red" variant="subtle" onClick={() => removeTier(index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  <TextInput
                    label="Label"
                    placeholder="VIP"
                    value={tier.label}
                    onChange={(event) => updateTier(index, 'label', event.currentTarget.value)}
                  />
                  <NumberInput
                    label="Price (ETB)"
                    value={tier.price}
                    min={0}
                    thousandSeparator="," 
                    onChange={(value) => updateTier(index, 'price', Number(value) || 0)}
                  />
                  <NumberInput
                    label="Quantity"
                    value={tier.quantity}
                    min={0}
                    onChange={(value) => updateTier(index, 'quantity', Number(value) || 0)}
                  />
                </SimpleGrid>
              </Card>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>
    </form>
  );
}

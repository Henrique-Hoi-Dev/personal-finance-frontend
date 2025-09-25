import React from 'react';
import { BaseLoading } from './BaseLoading';

export default {
  title: 'Atoms/BaseLoading',
  component: BaseLoading,
};

export const Default = () => <BaseLoading />;

export const WithText = () => <BaseLoading text="Carregando..." />;

export const Small = () => <BaseLoading size="sm" />;

export const Medium = () => <BaseLoading size="md" />;

export const Large = () => <BaseLoading size="lg" />;

export const Primary = () => <BaseLoading color="primary" />;

export const Secondary = () => <BaseLoading color="secondary" />;

export const White = () => (
  <div className="bg-blue-600 p-4 rounded">
    <BaseLoading color="white" />
  </div>
);

export const Gray = () => <BaseLoading color="gray" />;

export const AllSizes = () => (
  <div className="flex items-center space-x-4">
    <BaseLoading size="sm" />
    <BaseLoading size="md" />
    <BaseLoading size="lg" />
  </div>
);

export const AllColors = () => (
  <div className="flex items-center space-x-4">
    <BaseLoading color="primary" />
    <BaseLoading color="secondary" />
    <BaseLoading color="gray" />
  </div>
);

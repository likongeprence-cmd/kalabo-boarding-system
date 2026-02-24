// src/components/signup/RoleSelector.tsx
import React from 'react';
import { UserType } from '@/hooks/useAuth';
import { 
  UserCog, 
  Shield, 
  ShieldAlert, 
  Layers, 
  Users, 
  BookOpen 
} from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserType | null;
  onSelectRole: (role: UserType) => void;
  disabled?: boolean;
}

const roles = [
  {
    type: 'planner' as UserType,
    title: 'Planner',
    icon: UserCog,
    color: 'blue',
    approval: false
  },
  {
    type: 'headteacher' as UserType,
    title: 'Head Teacher',
    icon: Shield,
    color: 'purple',
    approval: false
  },
  {
    type: 'deputy' as UserType,
    title: 'Deputy Head',
    icon: ShieldAlert,
    color: 'indigo',
    approval: false
  },
  {
    type: 'hod' as UserType,
    title: 'HoD',
    icon: Layers,
    color: 'green',
    approval: true
  },
  {
    type: 'class_teacher' as UserType,
    title: 'Class Teacher',
    icon: Users,
    color: 'orange',
    approval: true
  },
  {
    type: 'subject_teacher' as UserType,
    title: 'Subject Teacher',
    icon: BookOpen,
    color: 'teal',
    approval: true
  }
];

export function RoleSelector({ selectedRole, onSelectRole, disabled }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Choose Your Role</h2>
        <p className="text-xs text-gray-500">Select your position</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.type;

          return (
            <button
              key={role.type}
              type="button"
              onClick={() => onSelectRole(role.type)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border transition-all text-left
                ${isSelected 
                  ? `bg-${role.color}-50 border-${role.color}-300 shadow-sm` 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center gap-2">
                <div className={`
                  p-1.5 rounded-lg
                  ${isSelected ? `bg-${role.color}-100` : 'bg-gray-100'}
                `}>
                  <Icon size={16} className={isSelected ? `text-${role.color}-600` : 'text-gray-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isSelected ? `text-${role.color}-700` : 'text-gray-700'}`}>
                    {role.title}
                  </p>
                  {role.approval && (
                    <span className="text-[10px] text-gray-500">Needs approval</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-2 bg-blue-50 rounded text-[10px] text-blue-600 leading-relaxed">
        Teachers need planner approval • Management accounts auto-approved
      </div>
    </div>
  );
}
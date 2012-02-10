# encoding: UTF-8

require 'spec_helper'

describe Company do
  let!(:default_scoring_rule) { Factory.create(:scoring_rule_default) }

  it 'should only allow a rate if velocity is present' do
    company = Factory.create(:company, :default_rate => 50, :default_velocity => nil)
    company.default_rate.should be_blank

    company = Factory.create(:company, :default_rate => 50, :default_velocity => 5)
    company.default_rate.should == 50
  end

  context 'company_users' do
    let(:account) { Factory.create(:account) }
    let(:user) { Factory.create(:user) }
    subject { Factory.create(:company, :account => account) }

    describe '#delete_user' do
      it 'should delete the company user that exists' do
        Factory.create(:company_user, :company => subject, :user => user)
        subject.company_users.map(&:user).should include(user)
        subject.delete_user user
        subject.reload
        subject.company_users.map(&:user).should_not include(user)
      end

      it 'should not fail if delete is called without any company user' do
        subject.delete_user user
        subject.company_users.map(&:user).should_not include(user)
      end
    end

    describe '#add_or_update_user' do
      it 'should update the existing user when one exists' do
        Factory.create(:company_user_with_no_rights, :company => subject, :user => user)
        subject.company_users.map(&:user).should include(user)
        subject.add_or_update_user user, :full
        subject.reload
        subject.company_users.map(&:user).should include(user)
        subject.company_users.first.privilege.should == Privilege.find(:full)
      end

      it 'should add a new user when one does not exist' do
        subject.add_or_update_user user, :read
        subject.reload
        subject.company_users.map(&:user).should include(user)
        subject.company_users.first.privilege.should == Privilege.find(:read)
      end
    end
  end
end